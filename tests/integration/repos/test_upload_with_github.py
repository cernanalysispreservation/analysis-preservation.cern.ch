# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

from __future__ import absolute_import, print_function

import json
import tarfile
import responses
from mock import Mock, patch

from github import GithubException
from invenio_files_rest.models import ObjectVersion

from cap.modules.repos.github_api import Github, GithubAPI
from cap.modules.repos.models import GitWebhookSubscriber, GitWebhook


def test_upload_when_missing_params_returns_400(client, deposit,
                                                auth_headers_for_example_user,
                                                json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach'
                       }))

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': "Missing url parameter."}


def test_upload_when_host_not_gitlab_nor_github_returns_400(
    client, deposit, auth_headers_for_example_user, json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://notsupported.com/owner/repository/mybranch',
            'webhook': 'push'
        })
    )

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': "Invalid git URL."}


def test_upload_when_user_doesnt_have_update_permission_returns_403(
    client, deposit, users, auth_headers_for_user, json_headers):
    other_user = users['lhcb_user']
    pid = deposit['_deposit']['id']

    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]
    deposit.edit_permissions(permissions)

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_user(other_user) + json_headers,
        data=json.dumps({'url': 'http://github.com/owner/repository/mybranch'
                         }))

    assert resp.status_code == 403


def test_upload_when_wrong_url(client, deposit, auth_headers_for_example_user,
                               json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://github.com/verywrongurl'
                       }))

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': 'Invalid git URL.'}

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://unknownhost.com/verywrongurl'
                       }))

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': 'Invalid git URL.'}


def test_upload_when_wrong_url_2(client, deposit,
                                 auth_headers_for_example_user, json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://github.com/verywrongurl'
                       }))

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': 'Invalid git URL.'}


@responses.activate
@patch.object(Github, 'get_repo')
def test_upload_when_user_gave_url_with_sha_and_tries_to_create_a_release_webhook_raises_an_error(
    m_get_repo, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockProject(object):
        id = 'id'
        def get_branch(self, name):
            raise GithubException(404, data={'message': 'Branch not found'})

        def get_commit(self, sha):
            mock = Mock()
            mock.sha = sha
            return mock

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://github.com/owner/repository/mycommitsha',
            'webhook': 'release'
        }))

    assert resp.status_code == 400
    assert resp.json == {
        'status': 400,
        'message': 'You cannot create a release webhook for a specific branch or sha.'
    }


@responses.activate
@patch.object(Github, 'get_repo')
def test_upload_when_user_gave_url_with_sha_and_tries_to_create_a_push_webhook_raises_an_error(
    m_get_repo, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockProject(object):
        id = 'id'
        def get_branch(self, name):
            raise GithubException(404, data={'message': 'Branch not found'})

        def get_commit(self, sha):
            mock = Mock()
            mock.sha = sha
            return mock

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://github.com/owner/repository/mycommitsha',
            'webhook': 'push'
        }))

    assert resp.status_code == 400
    assert resp.json == {
        'status': 400,
        'message': 'You cannot create a push webhook for a specific sha.'
    }


@responses.activate
@patch.object(Github, 'get_repo')
def test_upload_when_repo(m_get_repo, client, deposit,
                          auth_headers_for_example_user, json_headers,
                          git_repo_tar):
    class MockProject(object):
        id = 'id'
        def get_branch(self, name):
            mock = Mock()
            mock.name = name
            mock.commit.sha = 'mybranchsha'
            return mock

        def get_archive_link(self, format, ref):
            assert format == 'tarball'
            assert ref == 'mybranchsha'
            return ('https://codeload.github.com/owner/repository/'
                    'legacy.tar.gz/mybranchsha')

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']
    responses.add(responses.GET,
                  ('https://codeload.github.com/owner/repository/'
                   'legacy.tar.gz/mybranchsha'),
                  body=git_repo_tar,
                  content_type='application/x-gzip',
                  headers={
                      'Transfer-Encoding': 'chunked',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://github.com/owner/repository/mybranch',
                           'download': True
                       }))

    assert resp.status_code == 201

    obj = ObjectVersion.get(
        deposit.files.bucket.id,
        'repositories/github.com/owner/repository/mybranch.tar.gz')
    tar_obj = tarfile.open(obj.file.uri)
    repo_file_name = tar_obj.getmembers()[1]
    repo_content = tar_obj.extractfile(repo_file_name).read()

    assert repo_content == b'test repo for cap\n'


@responses.activate
@patch.object(Github, 'get_repo')
def test_upload_for_record_so_bucket_is_locked_returns_403(
    m_get_repo, client, record, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    pid = record['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://github.com/owner/repository/mybranch'
                       }))

    assert resp.status_code == 403


@responses.activate
@patch.object(GithubAPI, 'repo_id', 1)
@patch('cap.modules.repos.github_api.generate_secret',
       Mock(return_value='mysecret'))
@patch.object(Github, 'get_repo')
def test_upload_when_repo_and_creating_release_webhook(
    m_get_repo, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockProject(object):
        @property
        def default_branch(self):
            return 'def-branch'

        def get_branch(self, name):
            mock = Mock()
            mock.name = name
            mock.commit.sha = 'mybranchsha'
            return mock

        def get_archive_link(self, format, ref):
            assert format == 'tarball'
            assert ref == 'mybranchsha'
            return ('https://codeload.github.com/owner/repository/'
                    'legacy/def-branch.tar.gz')

        def create_hook(self, name, config, events, active):
            assert name == 'web'
            assert config == {
                'url': 'http://analysispreservation.cern.ch/api/repos/event',
                'content_type': 'json',
                'secret': 'mysecret'
            }
            assert events == ['release']
            assert active is True
            return Mock(
                url="https://api.github.com/repos/owner/repo/hooks/186091239",
                id=186091239)

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']
    responses.add(responses.GET,
                  ('https://codeload.github.com/owner/repository/'
                   'legacy/def-branch.tar.gz'),
                  body=git_repo_tar,
                  content_type='application/x-gzip',
                  headers={
                      'Transfer-Encoding': 'chunked',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://github.com/owner/repository',
                           'webhook': 'release'
                       }))

    assert resp.status_code == 201

    # no file was saved
    assert not deposit.files


@responses.activate
@patch.object(GithubAPI, 'repo_id', 1)
@patch('cap.modules.repos.github_api.generate_secret',
       Mock(return_value='mysecret'))
@patch.object(Github, 'get_repo')
def test_upload_when_repo_and_creating_push_webhook(
    m_get_repo, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockProject(object):
        @property
        def default_branch(self):
            return 'def-branch'

        def get_branch(self, name):
            mock = Mock()
            mock.name = name
            mock.commit.sha = 'mybranchsha'
            return mock

        def get_archive_link(self, format, ref):
            assert format == 'tarball'
            assert ref == 'mybranchsha'
            return ('https://codeload.github.com/owner/repository/'
                    'legacy/def-branch.tar.gz')

        def create_hook(self, name, config, events, active):
            assert name == 'web'
            assert config == {
                'url': 'http://analysispreservation.cern.ch/api/repos/event',
                'content_type': 'json',
                'secret': 'mysecret'
            }
            assert events == ['push']
            assert active is True
            return Mock(
                url="https://api.github.com/repos/owner/repo/hooks/186091239",
                id=186091239)

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']
    responses.add(responses.GET,
                  ('https://codeload.github.com/owner/repository/'
                   'legacy/def-branch.tar.gz'),
                  body=git_repo_tar,
                  content_type='application/x-gzip',
                  headers={
                      'Transfer-Encoding': 'chunked',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'url': 'http://github.com/owner/repository',
                           'type': 'attach',
                           'webhook': 'push',
                       }))

    assert resp.status_code == 201

    # no file was saved
    assert not deposit.files

    # webhook was created
    webhook = GitWebhook.query.filter_by(event_type='push').one()
    sub = GitWebhookSubscriber.query.filter_by(record_id=deposit.id, webhook_id=webhook.id).one()
    repo = sub.webhook.repo

    assert sub.webhook.branch == 'def-branch'
    assert sub.webhook.external_id == 186091239
    assert (repo.host, repo.owner, repo.name) == ('github.com', 'owner',
                                                  'repository')


@responses.activate
@patch.object(Github, 'get_repo')
def test_upload_when_repo_file(m_get_repo, client, deposit,
                               auth_headers_for_example_user, json_headers,
                               file_tar):
    class MockProject(object):
        def get_branch(self, name):
            mock = Mock()
            mock.name = name
            mock.commit.sha = 'mybranchsha'
            return mock

        def get_file_contents(self, filepath, ref):
            assert filepath == 'README.md'
            assert ref == 'mybranchsha'
            return Mock(download_url='https://raw.githubusercontent.com/owner/'
                        'repository/mybranchsha/README.md',
                        size=18)

    m_get_repo.return_value = MockProject()
    pid = deposit['_deposit']['id']
    responses.add(
        responses.GET,
        'https://raw.githubusercontent.com/owner/repository/mybranchsha/README.md',  # noqa
        body=file_tar,
        content_type='text/plain',
        headers={
            'Content-Length': '18',
            'Content-Encoding': 'gzip',
            'Content-Type': 'text/plain; charset=utf-8'
        },
        stream=True,
        status=200)

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://github.com/owner/repository/blob/mybranch/README.md'
        }))

    assert resp.status_code == 201

    obj = ObjectVersion.get(
        deposit.files.bucket.id,
        'repositories/github.com/owner/repository/mybranch/README.md')
    open_file = open(obj.file.uri)
    repo_content = open_file.read()

    assert repo_content == 'test repo for cap\n'


@patch('cap.modules.deposit.api.host_to_git_api')
@patch('cap.modules.deposit.api.create_git_api')
def test_create_repo_and_attach(
        m_create_api, m_api, client, deposit, auth_headers_for_example_user, json_headers, git_repo_tar):
    class MockRepo(object):
        html_url = 'https://github.com/owner/repository/'

    class MockAPI(object):
        branch = None
        repo_id = 'id'
        host = 'github.com'
        owner = 'owner'
        repo = 'repository'

        def create_webhook(type_):
            return 'id', 'secret'

    class MockProject(object):
        def create_repo_as_user(cls, user_id, repo_name, description='',
                                private=False, license=None, org_name=None, host=None):
            return MockRepo()

    m_api.return_value = MockProject()
    m_create_api.return_value = MockAPI()
    pid = deposit['_deposit']['id']
    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'create',
                           'name': 'repository',
                           'host': 'github.com'
                       }))

    assert resp.status_code == 201

    webhook = GitWebhook.query.filter_by(event_type=None).one()
    sub = GitWebhookSubscriber.query.filter_by(record_id=deposit.id, webhook_id=webhook.id).one()
    repo = sub.webhook.repo

    assert repo.name == 'repository'
    assert repo.owner == 'owner'
