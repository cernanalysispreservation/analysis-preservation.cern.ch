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
"""Integration tests for CAP api."""

from __future__ import absolute_import, print_function
from conftest import add_role_to_user


def test_permissions_give_read_access(users, create_schema, create_deposit,
                                      client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'deposit-schema-read': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS')
    depid = deposit['_deposit']['id']

    resp = client.get(f'/deposits/{depid}', headers=headers)

    assert resp.status_code == 200
    assert not resp.json['can_update']
    assert not resp.json['can_admin']


def test_permissions_give_update_access(users, create_schema, create_deposit,
                                      client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'deposit-schema-read': ['test-egroup@cern.ch'],
                          'deposit-schema-update': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS')
    depid = deposit['_deposit']['id']

    resp = client.get(f'/deposits/{depid}', headers=headers)

    assert resp.status_code == 200
    assert resp.json['can_update']
    assert not resp.json['can_admin']


def test_permissions_give_admin_access(users, create_schema, create_deposit,
                                      client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'deposit-schema-read': ['test-egroup@cern.ch'],
                          'deposit-schema-update': ['test-egroup@cern.ch'],
                          'deposit-schema-admin': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS')
    depid = deposit['_deposit']['id']

    resp = client.get(f'/deposits/{depid}', headers=headers)

    assert resp.status_code == 200
    assert resp.json['can_update']
    assert resp.json['can_admin']


def test_permissions_give_deposit_read_access_cant_read_record(
        users, create_schema, create_deposit,client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'deposit-schema-read': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS', publish=True)
    recid = deposit['control_number']

    resp = client.get(f'/records/{recid}', headers=headers)

    assert resp.status_code == 403


def test_permissions_give_record_read_access(
        users, create_schema, create_deposit,client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'record-schema-read': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS', publish=True)
    recid = deposit['control_number']

    resp = client.get(f'/records/{recid}', headers=headers)

    assert resp.status_code == 200
    assert not resp.json['can_update']


def test_permissions_give_record_update_access(
        users, create_schema, create_deposit, client, auth_headers_for_user):
    owner, user = users['cms_user'], users['lhcb_user']
    headers = auth_headers_for_user(user) + [('Accept', 'application/form+json')]
    add_role_to_user(user, 'test-egroup@cern.ch')

    create_schema('test-schema', experiment='CMS',
                  config={
                      'permissions': {
                          'record-schema-read': ['test-egroup@cern.ch'],
                          'record-schema-update': ['test-egroup@cern.ch']
                      }
                  })

    deposit = create_deposit(owner, 'test-schema', experiment='CMS', publish=True)
    recid = deposit['control_number']

    resp = client.get(f'/records/{recid}', headers=headers)

    assert resp.status_code == 200
    assert resp.json['can_update']
