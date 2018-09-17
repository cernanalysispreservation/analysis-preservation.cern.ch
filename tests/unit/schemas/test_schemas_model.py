# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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


from pytest import raises
from sqlalchemy.exc import IntegrityError

from cap.modules.schemas.errors import SchemaDoesNotExist
from cap.modules.schemas.models import Schema


def test_when_schema_with_same_name_and_version_raises_IntegrityError(db):
    with raises(IntegrityError):
        schema = {
            'name': 'records/ana1',
            'major': 1,
            'minor': 0,
            'patch': 1
        }
        db.session.add(Schema(**schema))
        db.session.add(Schema(**schema))
        db.session.commit()


def test_create_newer_version_of_existing_schema(db):
    schema = {
        'name': 'records/ana1',
        'major': 1,
        'minor': 0,
        'patch': 1,
    }
    db.session.add(Schema(**schema))
    schema.update({'patch': 2})
    db.session.add(Schema(**schema))
    db.session.commit()

    assert Schema.query.count() == 2


def test_get_by_fullstring(db):
    schema = Schema(**{'name': 'records/ana1',
                       'major': 1,
                       'minor': 0,
                       'patch': 1})
    schema2 = Schema(**{'name': 'records/ana2',
                        'major': 2,
                        'minor': 1,
                        'patch': 1})
    db.session.add(schema)
    db.session.add(schema2)
    db.session.commit()

    assert Schema.get_by_fullstring('records/ana1-v1.0.1.json') == schema
    assert Schema.get_by_fullstring('records/ana2-v2.1.1.json') == schema2
    assert Schema.get_by_fullstring('/records/ana2-v2.1.1.json') == schema2
    assert Schema.get_by_fullstring('/records/ana2-v2.1.1') == schema2


def test_get_by_fullstring_when_non_existing_raise_SchemaDoesNotExist(db):
    with raises(SchemaDoesNotExist):
        Schema.get_by_fullstring('/non-existing/schema/ana2-v2.1.1')


def test_get_latest_version_of_schema(db):
    schemas = [
        {'name': 'name', 'major': 0, 'minor': 6, 'patch': 6},
        {'name': 'name', 'major': 1, 'minor': 5, 'patch': 5},
        {'name': 'name', 'major': 2, 'minor': 3, 'patch': 4},
        {'name': 'name', 'major': 2, 'minor': 4, 'patch': 0},
        {'name': 'name', 'major': 2, 'minor': 4, 'patch': 3},
    ]

    for x in schemas:
        db.session.add(Schema(**x))
    db.session.commit()
    latest = Schema.get_latest(name='name')

    assert latest.version == "2.4.3"
