# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""Github interface class."""

import hashlib
import hmac

from flask import request
from flask_login import current_user
from github import Github, GithubException, GithubObject,\
    UnknownObjectException, BadCredentialsException

from cap.modules.auth.ext import _fetch_token
from cap.modules.deposit.errors import FileUploadError

from .errors import (GitError, GitIntegrationError, GitObjectNotFound,
                     GitRequestWithInvalidSignature, GitUnauthorizedRequest)
from .interface import GitAPI
from .utils import generate_secret, get_webhook_url


class GithubAPI(GitAPI):
    """GitHub-specific API class."""
    def __init__(self, host, owner, repo, branch_or_sha=None, user_id=None):
        """Initialize a GitHub API instance."""
        self.host = host
        self.owner = owner
        self.repo = repo
        self.token = self._get_token(user_id)
        self.api = Github(self.token)

        try:
            self.project = self.api.get_repo(f'{self.owner}/{self.repo}',
                                             lazy=False)
        except UnknownObjectException:
            raise GitObjectNotFound(
                'This repository does not exist or you don\'t have access.')

        self.branch, self.sha = self._get_branch_and_sha(branch_or_sha)

    def __repr__(self):
        """String representation."""
        return f'API for {self.host}/{self.owner}/{self.repo}/{self.branch or self.sha}'  # noqa

    @property
    def repo_id(self):
        return self.project.id

    @property
    def auth_headers(self):
        return {'Authorization': f'token {self.token}'} if self.token else {}

    def get_repo_download(self):
        """Get repo download url."""
        url = self.project.get_archive_link("tarball", ref=self.sha)
        return url.split('?token=')[0]

    def get_file_download(self, filepath):
        """Get file download url and size."""
        try:
            file_desc = self.project.get_file_contents(filepath, ref=self.sha)
        except UnknownObjectException:
            raise GitObjectNotFound(f'File {filepath} does not exist')

        if isinstance(file_desc, list):
            raise GitError(
                f'Downloading directories is currently not supported.')

        return file_desc.download_url.split('?token=')[0], file_desc.size

    def verify_request(self, secret):
        """Verify that request comes from trusted source."""
        signature = request.headers['X-Hub-Signature'].replace('sha1=', '')
        received = hmac.new(bytes(secret, 'utf-8'), request.data, hashlib.sha1)

        if not hmac.compare_digest(received.hexdigest(), str(signature)):
            raise GitRequestWithInvalidSignature

    def create_webhook(self, _type='release'):
        """Create and enable a webhook for the specific repo."""
        url = get_webhook_url()
        secret = generate_secret()

        try:
            hook = self.project.create_hook(
                name='web',
                config=dict(
                    url=url,
                    content_type='json',
                    secret=secret,
                ),
                events=[_type],
                active=True,
            )
        except UnknownObjectException:
            raise GitIntegrationError(
                'No permission to create webhook for this repository.')
        except GithubException:
            raise GitIntegrationError(
                'Push webhook for this repository already exist')

        return hook.id, secret

    def ping_webhook(self, hook_id):
        """Check if webhook with given github id still exists."""
        try:
            self.project.get_hook(hook_id)
        except UnknownObjectException:
            raise GitObjectNotFound(
                'Webhook not found or you don\'t have access.')

    def delete_webhook(self, hook_id):
        """Delete webhook with given github id."""
        try:
            hook = self.project.get_hook(hook_id)
            hook.delete()
        except UnknownObjectException:
            raise GitObjectNotFound(
                'Webhook not found or you don\'t have access.')

    def _get_branch_and_sha(self, branch_or_sha):
        if not branch_or_sha:
            # try default branch
            try:
                branch = self.project.get_branch(self.project.default_branch)
                branch, sha = branch.name, branch.commit.sha
            except GithubException:
                raise GitObjectNotFound('Your repository is empty. '
                                        'Make your initial commit first.')
        else:
            try:
                # check if branch exists
                branch = self.project.get_branch(branch_or_sha)
                branch, sha = branch.name, branch.commit.sha
            except GithubException:
                # check if commit with this sha exists
                try:
                    sha = self.project.get_commit(branch_or_sha).sha
                    branch = None
                except GithubException:
                    raise GitObjectNotFound(
                        f'{branch_or_sha} does not match any branch or sha.')

        return branch, sha

    @classmethod
    def create_repo(cls, token, repo_name, description,
                    private, license, org_name):
        """
        Create a github repo as user/organization.
        The available licenses can be found here:
        https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository  # noqa
        """
        gh = Github(token)
        api = gh.get_organization(org_name) if org_name else gh.get_user()
        license = license if license else GithubObject.NotSet

        try:
            return api.create_repo(
                repo_name, description=description,
                private=private, auto_init=True,
                license_template=license)

        except (BadCredentialsException,
                UnknownObjectException,
                GithubException) as ex:
            raise FileUploadError(description=ex.data.get('message'))

    @classmethod
    def create_repo_as_user(cls, user_id, repo_name, description='',
                            private=False, license=None, org_name=None,
                            host=None):
        """Create repo a user, using the current user's token."""
        token = cls._get_token(user_id)
        if not token:
            raise GitUnauthorizedRequest(
                'Github requires authorization - '
                'connect your CERN account: Settings -> Integrations.')

        repo = cls.create_repo(
            token, repo_name, description,
            private, license, org_name)
        return repo

    @classmethod
    def create_repo_as_collaborator(cls, create_token, org_name, repo_name,
                                    description='', private=False,
                                    license=None, host=None):
        """
        Create repo through an organization admin,
        adding the current user as a member/collaborator.
        """
        repo = cls.create_repo(
            create_token, repo_name, description,
            private, license, org_name)

        try:
            collab_token = cls._get_token(current_user.id)
            collaborator = Github(collab_token).get_user().login
            invitation = repo.add_to_collaborators(collaborator)

            return repo, invitation
        except UnknownObjectException as ex:
            raise FileUploadError(description=ex.data.get('message'))

    @classmethod
    def _get_token(cls, user_id):
        token_obj = _fetch_token('github', user_id) if user_id else None
        return token_obj.get('access_token') if token_obj else None
