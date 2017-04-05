# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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


"""Pytest configuration."""

from __future__ import absolute_import, print_function

import os
import shutil
import tempfile
from uuid import uuid4


import pytest

from cap.factory import create_app
from cap.modules.deposit.api import CAPDeposit as Deposit
from elasticsearch.exceptions import RequestError
from flask_cli import ScriptInfo
from flask_security import login_user
from invenio_accounts.testutils import create_test_user
from invenio_db import db as db_
from invenio_deposit.minters import deposit_minter
from invenio_search import current_search, current_search_client
from sqlalchemy_utils.functions import create_database, database_exists
from invenio_files_rest.models import Location
from six import BytesIO


@pytest.yield_fixture(scope='session')
def instance_path():
    """Default instance path."""
    path = tempfile.mkdtemp()

    yield path

    shutil.rmtree(path)


@pytest.fixture(scope='session')
def env_config(instance_path):
    """Default instance path."""
    os.environ.update(
        APP_INSTANCE_PATH=os.environ.get(
            'INSTANCE_PATH', instance_path),
    )

    return os.environ


@pytest.fixture(scope='session')
def default_config():
    """Default configuration."""
    return dict(
        DEBUG_TB_ENABLED=False,
        SQLALCHEMY_DATABASE_URI=os.environ.get(
            'SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db'),
        TESTING=True,
    )


@pytest.yield_fixture(scope='session')
def app(env_config, default_config):
    """Flask application fixture."""
    app = create_app(**default_config)

    with app.app_context():
        yield app


@pytest.yield_fixture(scope='session')
def script_info(app):
    """Ensure that the database schema is created."""
    yield ScriptInfo(create_app=lambda info: app)


@pytest.yield_fixture(scope='session')
def db(app):
    """Setup database."""
    if not database_exists(str(db_.engine.url)):
        create_database(str(db_.engine.url))
    db_.create_all()
    yield db_
    db_.session.remove()
    db_.drop_all()


@pytest.yield_fixture(scope='session')
def es(app):
    """Provide elasticsearch access."""
    try:
        list(current_search.create())
    except RequestError:
        list(current_search.delete(ignore=[400, 404]))
        list(current_search.create())
    current_search_client.indices.refresh()
    yield current_search_client
    list(current_search.delete(ignore=[404]))


@pytest.fixture()
def users(app, db):
    """Create users."""
    user1 = create_test_user(
        email='cms@inveniosoftware.org', password='cmscms')

    return [
        {'email': user1.email, 'id': user1.id}
    ]


@pytest.yield_fixture()
def location(db):
    """File system location."""
    tmppath = tempfile.mkdtemp()

    loc = Location(
        name='testloc',
        uri=tmppath,
        default=True
    )
    db.session.add(loc)
    db.session.commit()

    yield loc

    shutil.rmtree(tmppath)


@pytest.fixture()
def deposit_metadata():
    """Raw metadata of deposit."""
    data = {
        '$schema': 'https://analysispreservation.cern.ch/app/schemas/deposits/records/cms-analysis-v0.0.1.json',
        'basic_info': {
            'analysis_number': 'dream_team',
            'people_info': [
                {}
            ]
        }
    }
    return data


@pytest.fixture()
def deposit_file(deposit, db):
    """Deposit files."""
    deposit.files['test.txt'] = BytesIO(b'test')
    db.session.commit()
    return deposit.files


@pytest.fixture()
def deposit(app, es, users, location, deposit_metadata):
    """New deposit with files."""
    with app.test_request_context():
        datastore = app.extensions['security'].datastore
        login_user(datastore.get_user(users[0]['email']))
        id_ = uuid4()
        deposit_minter(id_, deposit_metadata)
        deposit = Deposit.create(deposit_metadata, id_=id_)
        db_.session.commit()
    current_search.flush_and_refresh(
        index='deposits-records-cms-analysis-v0.0.1')
    return deposit
