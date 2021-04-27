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
from pytest import mark

from gitlab.exceptions import GitlabGetError
from invenio_files_rest.models import ObjectVersion

from cap.modules.repos.models import GitWebhookSubscriber, GitWebhook


def test_upload_when_wrong_url(client, deposit, auth_headers_for_example_user,
                               json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://gitlab.cern.ch/verywrongurl'
                       }))

    assert resp.status_code == 400
    assert resp.json == {'status': 400, 'message': 'Invalid git URL.'}


@mark.skip
@patch('cap.modules.repos.gitlab_api.Gitlab')
@patch('cap.modules.deposit.api.create_git_api')
def test_upload_when_user_gave_url_with_sha_and_tries_to_create_a_push_webhook_raises_an_error(
    m_api, m_gitlab, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockCommitManager:
        def get(self, sha):
            assert sha == 'mycommitsha'
            return Mock(id='mycommitsha')

    class MockBranchManager:
        def get(self, name):
            raise GitlabGetError('Branch Not Found', 404)

    class MockProjectManager:
        def get(self, name, lazy):
            return Mock(
                branches=MockBranchManager(),
                commits=MockCommitManager(),
            )

    def create_webhook(type_):
        return 'id', 'secret'

    m_gitlab.return_value = Mock(projects=MockProjectManager())
    m_api.return_value = Mock(repo_id='id', host='gitlab.cern.ch', repo='repo',
                              owner='owner', branch='mycommitsha',
                              create_webhook=create_webhook)
    pid = deposit['_deposit']['id']

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://gitlab.cern.ch/owner/repository/mycommitsha',
            'webhook': 'push'
        }))

    assert resp.status_code == 400
    assert resp.json == {
        'status': 400,
        'message': 'You cannot create a push webhook for a specific sha.'
    }


@responses.activate
@patch('cap.modules.repos.gitlab_api.Gitlab')
def test_upload_when_repo(m_gitlab, client, deposit,
                          auth_headers_for_example_user, json_headers,
                          git_repo_tar):
    class MockBranchManager:
        def get(self, name):
            m = Mock(commit=dict(id='mybranchsha'))
            m.name = 'mybranch'
            return m

    class MockProjectManager:
        def get(self, name, lazy):
            return Mock(branches=MockBranchManager(), id='123')

    m_gitlab.return_value = Mock(projects=MockProjectManager())
    pid = deposit['_deposit']['id']
    responses.add(responses.GET, (
        'https://gitlab.cern.ch/api/v4/projects/123/repository/archive?sha=mybranchsha'
    ),
                  body=git_repo_tar,
                  content_type='application/octet_stream',
                  headers={
                      'Transfer-Encoding': 'binary',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://gitlab.cern.ch/owner/repository/mybranch',
            'download': True
        }))

    assert resp.status_code == 201

    obj = ObjectVersion.get(
        deposit.files.bucket.id,
        'repositories/gitlab.cern.ch/owner/repository/mybranch.tar.gz')
    tar_obj = tarfile.open(obj.file.uri)
    repo_file_name = tar_obj.getmembers()[1]
    repo_content = tar_obj.extractfile(repo_file_name).read()

    assert repo_content == b'test repo for cap\n'


@responses.activate
def test_upload_for_record_so_bucket_is_locked_returns_403(
    client, record, auth_headers_for_example_user, json_headers, git_repo_tar):
    pid = record['_deposit']['id']

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps(
            {'url': 'http://gitlab.cern.ch/owner/repository/mybranch'}))

    assert resp.status_code == 403


@responses.activate
@patch('cap.modules.repos.gitlab_api.generate_secret',
       Mock(return_value='mysecret'))
@patch('cap.modules.repos.gitlab_api.Gitlab')
def test_upload_when_repo_and_creating_push_webhook(
    m_gitlab, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockHooksManager:
        def create(self, data):
            assert data == {
                'url': 'http://analysispreservation.cern.ch/api/repos/event',
                'token': 'mysecret',
                'push_events': True,
                'tag_push_events': False
            }
            return Mock(id=12345)

    class MockBranchManager:
        def get(self, name):
            m = Mock(commit=dict(id='mybranchsha'))
            m.name = 'mybranch'
            return m

    class MockProjectManager:
        def get(self, name, lazy):
            return Mock(branches=MockBranchManager(),
                        hooks=MockHooksManager(),
                        id='123')

    m_gitlab.return_value = Mock(projects=MockProjectManager())
    pid = deposit['_deposit']['id']

    responses.add(responses.GET, (
        'https://gitlab.cern.ch/api/v4/projects/123/repository/archive?sha=mybranchsha'
    ),
                  body=git_repo_tar,
                  content_type='application/octet_stream',
                  headers={
                      'Transfer-Encoding': 'binary',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://gitlab.cern.ch/owner/repository/mybranch',
            'webhook': 'push'
        }))

    assert resp.status_code == 201

    # no file was saved
    assert not deposit.files

    # webhook was created
    webhook = GitWebhook.query.filter_by(event_type='push').one()
    sub = GitWebhookSubscriber.query.filter_by(record_id=deposit.id, webhook_id=webhook.id).one()
    repo = sub.webhook.repo

    assert sub.webhook.branch == 'mybranch'
    assert (repo.host, repo.owner, repo.name) == ('gitlab.cern.ch', 'owner',
                                                  'repository')


@responses.activate
@patch('cap.modules.repos.gitlab_api.generate_secret',
       Mock(return_value='mysecret'))
@patch('cap.modules.repos.gitlab_api.Gitlab')
def test_upload_when_repo_and_creating_release_webhook(
    m_gitlab, client, deposit, auth_headers_for_example_user, json_headers,
    git_repo_tar):
    class MockHooksManager:
        def create(self, data):
            assert data == {
                'url': 'http://analysispreservation.cern.ch/api/repos/event',
                'token': 'mysecret',
                'push_events': False,
                'tag_push_events': True
            }
            return Mock(id=12345)

    class MockBranchManager:
        def get(self, name):
            m = Mock(commit=dict(id='defaultbranchsha'))
            m.name = 'defaultbranch'
            return m

    class MockProjectManager:
        def get(self, name, lazy):
            return Mock(branches=MockBranchManager(),
                        default_branch='defaultbranch',
                        hooks=MockHooksManager(),
                        id='123')

    m_gitlab.return_value = Mock(projects=MockProjectManager())
    pid = deposit['_deposit']['id']

    responses.add(responses.GET, (
        'https://gitlab.cern.ch/api/v4/projects/123/repository/archive?sha=defaultbranchsha'
    ),
                  body=git_repo_tar,
                  content_type='application/octet_stream',
                  headers={
                      'Transfer-Encoding': 'binary',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post(f'/deposits/{pid}/actions/upload',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({
                           'type': 'attach',
                           'url': 'http://gitlab.cern.ch/owner/repository',
                           'webhook': 'release'
                       }))

    assert resp.status_code == 201

    # no file was saved
    assert not deposit.files


@responses.activate
@patch('cap.modules.repos.gitlab_api.Gitlab')
def test_upload_when_repo_file(m_gitlab, client, deposit,
                               auth_headers_for_example_user, json_headers):
    class MockBranchManager:
        def get(self, name):
            m = Mock(commit=dict(id='mybranchsha'))
            m.name = 'mybranch'
            return m

    class MockProjectManager:
        def get(self, name, lazy):
            return Mock(branches=MockBranchManager(), id='123')

    m_gitlab.return_value = Mock(projects=MockProjectManager())
    pid = deposit['_deposit']['id']
    responses.add(
        responses.HEAD,
        ('https://gitlab.cern.ch/api/v4/projects/123/repository/files/'
         'README.md/raw?ref=mybranchsha'),
        content_type='application/json',
        status=200)
    responses.add(
        responses.GET,
        ('https://gitlab.cern.ch/api/v4/projects/123/repository/files/'
         'README.md/raw?ref=mybranchsha'),
        content_type='text/plain; charset=utf-8',
        body=b'readme',
        stream=True,
        headers={'Content-Length': '6'},
        status=200)

    resp = client.post(
        f'/deposits/{pid}/actions/upload',
        headers=auth_headers_for_example_user + json_headers,
        data=json.dumps({
            'type': 'attach',
            'url': 'http://gitlab.cern.ch/owner/repository/blob/mybranch/README.md'
        }))

    assert resp.status_code == 201

    obj = ObjectVersion.get(
        deposit.files.bucket.id,
        'repositories/gitlab.cern.ch/owner/repository/mybranch/README.md')
    open_file = open(obj.file.uri)
    repo_content = open_file.read()

    assert repo_content == 'readme'


@patch('cap.modules.deposit.api.host_to_git_api')
@patch('cap.modules.deposit.api.create_git_api')
def test_create_repo_and_attach(
        m_create_api, m_api, client, deposit, auth_headers_for_example_user, json_headers, git_repo_tar):
    class MockRepo(object):
        attributes = {
            'web_url': 'https://gitlab.cern.ch/owner/repository/'
        }

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
                           'host': 'gitlab.com'
                       }))

    assert resp.status_code == 201

    webhook = GitWebhook.query.filter_by(event_type=None).one()
    sub = GitWebhookSubscriber.query.filter_by(record_id=deposit.id, webhook_id=webhook.id).one()
    repo = sub.webhook.repo

    assert repo.name == 'repository'
    assert repo.owner == 'owner'
