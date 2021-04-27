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
"""Gitlab interface class."""

import requests
from flask import request
from flask_login import current_user
from gitlab import Gitlab, DEVELOPER_ACCESS
from gitlab.exceptions import GitlabAuthenticationError, GitlabGetError,\
    GitlabCreateError

from cap.modules.auth.ext import _fetch_token
from cap.modules.deposit.errors import FileUploadError

from .errors import (GitIntegrationError, GitObjectNotFound,
                     GitRequestWithInvalidSignature, GitUnauthorizedRequest)
from .interface import GitAPI
from .utils import generate_secret, get_webhook_url


class GitlabAPI(GitAPI):
    """GitLab API class."""
    def __init__(self, host, owner, repo, branch_or_sha=None, user_id=None):
        """Initialize a GitLab API instance."""
        self.host = host
        self.owner = owner
        self.repo = repo
        self.token = self._get_token(user_id)
        self.api = Gitlab(f'https://{self.host}', oauth_token=self.token)
        self.api_url = f'https://{host}/api/v4/projects'

        try:
            self.project = self.api.projects.get(f'{owner}/{repo}', lazy=False)
        except GitlabAuthenticationError:
            raise GitUnauthorizedRequest(
                'Gitlab requires authorization - '
                'connect your CERN account: Settings -> Integrations.')

        except GitlabGetError:
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
        return {'Private-Token': self.token} if self.token else {}

    def get_repo_download(self):
        """Get repo download url."""
        return f'{self.api_url}/{self.repo_id}/repository/archive?sha={self.sha}'  # noqa

    def get_file_download(self, filepath):
        """Get file download url and size."""
        download_url = \
                f'{self.api_url}/{self.repo_id}/repository/files/{filepath}/raw?ref={self.sha}'  # noqa

        response = requests.head(download_url, headers=self.auth_headers)
        if response.status_code != 200:
            raise GitObjectNotFound(f'{filepath} is not a valid filepath.')

        return download_url, None

    def verify_request(self, secret):
        """Verify that request comes from trusted source."""
        if request.headers.get('X-Gitlab-Token') != secret:
            raise GitRequestWithInvalidSignature

    def create_webhook(self, _type='release'):
        """Create and enable a webhook for the specific repo."""
        url = get_webhook_url()
        secret = generate_secret()
        try:
            hook = self.project.hooks.create({
                'url': url,
                'push_events': True if _type == 'push' else False,
                'tag_push_events': True if _type == 'release' else False,
                'token': secret,
            })
        except GitlabAuthenticationError:
            raise GitIntegrationError(
                'No permission to create webhook for this repository.')

        return hook.id, secret

    def ping_webhook(self, hook_id):
        """Check if webhook with given gitlab id still exists."""
        try:
            self.project.hooks.get(hook_id)
        except GitlabGetError:
            raise GitObjectNotFound('Webhook not found')
        except GitlabAuthenticationError:
            raise GitObjectNotFound('No permission to this webhook')

    def delete_webhook(self, hook_id):
        """Delete webhook with given gitlab id."""
        try:
            self.project.hooks.delete(hook_id)
        except GitlabGetError:
            raise GitObjectNotFound('Webhook not found')
        except GitlabAuthenticationError:
            raise GitObjectNotFound('No permission to delete this webhook')

    def _get_branch_and_sha(self, branch_or_sha):
        if not branch_or_sha:
            # try default branch
            default_branch = self.project.default_branch
            if not default_branch:
                raise GitObjectNotFound('Your repository is empty. '
                                        'Make your initial commit first.')

            branch = self.project.branches.get(default_branch)
            branch, sha = branch.name, branch.commit['id']
        else:
            try:
                # check if branch exists
                branch = self.project.branches.get(branch_or_sha)
                branch, sha = branch.name, branch.commit['id']
            except GitlabGetError:
                # check if commit with this sha exists
                try:
                    sha = self.project.commits.get(branch_or_sha).id
                    branch = None
                except GitlabGetError:
                    raise GitObjectNotFound(
                        f'{branch_or_sha} does not match any branch or sha.')

        return branch, sha

    @classmethod
    def create_repo(cls, token, repo_name, description,
                    private, license, org_name, host):
        """
        Create a gitlab repo as user/organization.
        """
        try:
            gitlab = Gitlab(f'https://{host}', oauth_token=token)
            return gitlab.projects.create({
                'name': repo_name,
                'description': description,
                'namespace_id': org_name,
                'visibility': 'private' if private else 'public',
                'initialize_with_readme': True
            })

        except (GitlabCreateError,
                GitlabAuthenticationError,
                GitlabGetError) as ex:
            raise FileUploadError(description=ex.error_message)

    @classmethod
    def create_repo_as_user(cls, user_id, repo_name, description='',
                            private=False, license=None, org_name=None,
                            host=None):
        """Create repo a user, using the current user's token."""
        token = cls._get_token(user_id)
        if not token:
            raise GitUnauthorizedRequest(
                'Gitlab requires authorization - '
                'connect your CERN account: Settings -> Integrations.')

        repo = cls.create_repo(
            token, repo_name, description, private,
            license, org_name, host)
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
            private, license, org_name, host)

        try:
            collab_token = cls._get_token(current_user.id)
            gitlab = Gitlab(f'https://{host}', oauth_token=collab_token)
            gitlab.auth()

            collaborator = gitlab.user.id
            member = repo.members.create({
                'user_id': collaborator,
                'access_level': DEVELOPER_ACCESS
            })

            return repo, member
        except GitlabCreateError as ex:
            raise FileUploadError(description=ex.error_message)

    @classmethod
    def _get_token(cls, user_id):
        token_obj = _fetch_token('gitlab', user_id) if user_id else None
        if not token_obj:
            return None
        return token_obj.get('access_token')
