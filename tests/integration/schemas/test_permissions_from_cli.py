# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2020 CERN.
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
import json
from conftest import add_role_to_user


def test_action_give_deposit_access_and_user_sees_deposit(
        app, db, users, client, create_schema, auth_headers_for_user,
        json_headers, create_deposit, cli_runner):
    owner = users['cms_user']
    owner_headers = auth_headers_for_user(owner) + json_headers

    # create schema
    schema_data = json.dumps(
        dict(name='test-schema', version='1.0.0',)
    )
    schema_resp = client.post('/jsonschemas/', data=schema_data, headers=owner_headers)
    assert schema_resp.status_code == 200

    # create deposit
    metadata = json.dumps({'$ana_type': 'test-schema'})
    deposit_resp = client.post('/deposits/', data=metadata, headers=owner_headers)
    assert deposit_resp.status_code == 201

    # new user
    user = users['lhcb_user']
    add_role_to_user(user, 'test-users@cern.ch')
    headers = auth_headers_for_user(user)

    res = cli_runner(
        'fixtures permissions -p read -r test-users@cern.ch --allow --deposit test-schema')
    assert res.exit_code == 0
    assert 'Process finished.' in res.output

    # get deposit, needs to have access to draft + schemas
    resp = client.get(f"/deposits/{deposit_resp.json['id']}",
                      headers=headers + [('Accept', 'application/form+json')])
    assert resp.status_code == 200
    assert 'schemas' in resp.json.keys()

    # no jsonschema access
    resp = client.get("/jsonschemas/test-schema", headers=headers)
    assert resp.status_code == 403


def test_action_give_record_access_and_user_sees_record(
        app, db, users, client, create_schema, auth_headers_for_user,
        json_headers, create_deposit, cli_runner):
    owner = users['cms_user']
    owner_headers = auth_headers_for_user(owner) + json_headers

    # create schema
    schema_data = json.dumps(
        dict(name='test-schema', version='1.0.0',)
    )
    schema_resp = client.post('/jsonschemas/', data=schema_data, headers=owner_headers)
    assert schema_resp.status_code == 200

    # create deposit
    metadata = json.dumps({'$ana_type': 'test-schema'})
    deposit_resp = client.post('/deposits/', data=metadata, headers=owner_headers)
    assert deposit_resp.status_code == 201

    # publish deposit
    published_resp = client.post(
        f"/deposits/{deposit_resp.json['id']}/actions/publish",
        data=metadata,
        headers=owner_headers)
    assert published_resp.status_code == 202

    # new user
    user = users['lhcb_user']
    add_role_to_user(user, 'test-users@cern.ch')
    headers = auth_headers_for_user(user)

    res = cli_runner(
        'fixtures permissions -p read -r test-users@cern.ch --allow --record test-schema')
    assert res.exit_code == 0

    # get deposit, needs to have access to draft + schemas
    resp = client.get(f"/records/{published_resp.json['recid']}",
                      headers=headers + [('Accept', 'application/form+json')])
    assert resp.status_code == 200
    assert 'schemas' in resp.json.keys()


def test_action_give_schema_access_and_user_sees_schema(
        app, db, users, client, auth_headers_for_user, json_headers, cli_runner):
    owner = users['cms_user']
    owner_headers = auth_headers_for_user(owner) + json_headers

    # create schema
    schema_data = json.dumps(
        dict(name='test-schema', version='1.0.0',)
    )
    schema_resp = client.post('/jsonschemas/', data=schema_data, headers=owner_headers)
    assert schema_resp.status_code == 200

    # new user
    user = users['lhcb_user']
    add_role_to_user(user, 'test-users@cern.ch')
    headers = auth_headers_for_user(user)

    res = cli_runner(
        'fixtures permissions -p read -r test-users@cern.ch --allow --schema test-schema')
    assert res.exit_code == 0

    # jsonschema access
    resp = client.get("/jsonschemas/test-schema", headers=headers)
    assert resp.status_code == 200


def test_action_give_deposit_access_and_user_sees_deposit_in_search(
        app, db, users, client, create_schema, auth_headers_for_user, create_deposit, cli_runner):
    owner = users['cms_user']
    create_schema('test-analysis')
    create_deposit(owner, 'test-analysis')

    # new user
    user = users['lhcb_user']
    add_role_to_user(user, 'test-users@cern.ch')
    headers = auth_headers_for_user(user) + [('Accept', 'application/basic+json')]

    res = cli_runner(
        'fixtures permissions -p read -r test-users@cern.ch --allow --deposit test-analysis')
    assert res.exit_code == 0

    # get all deposits by search
    resp = client.get("/deposits?q=", headers=headers)

    assert resp.status_code == 200
    assert resp.json['hits']['total'] == 1
