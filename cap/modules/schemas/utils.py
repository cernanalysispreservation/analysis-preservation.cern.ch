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
"""Utils for Schemas module."""

from itertools import groupby

import click
from flask import current_app
from invenio_accounts.models import Role
from invenio_access.models import ActionRoles
from invenio_db import db
from sqlalchemy.exc import IntegrityError

from .models import Schema
from .permissions import ReadSchemaPermission


def _filter_by_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [x for x in schemas_list if ReadSchemaPermission(x).can()]


def _filter_only_latest(schemas_list):
    """Return only latest version of schemas."""
    return [next(g) for k, g in groupby(schemas_list, lambda s: s.name)]


def get_schemas_for_user(latest=True):
    """Return all schemas current user has read access to."""
    schemas = Schema.query \
                    .order_by(
                        Schema.name,
                        Schema.major.desc(),
                        Schema.minor.desc(),
                        Schema.patch.desc()) \
                    .all()

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def get_indexed_schemas_for_user(latest=True):
    """Return all indexed schemas current user has read access to."""
    schemas = Schema.query \
                    .filter_by(is_indexed=True) \
                    .order_by(
                        Schema.name,
                        Schema.major.desc(),
                        Schema.minor.desc(),
                        Schema.patch.desc()) \
                    .all()

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def actions_from_type(_type, perms):
    """
    Get user-made action names depending on the type. When the type is record
    or deposit, the user should also get schema-read access.
    """
    if _type == 'record':
        return [f'record-schema-{perm}' for perm in perms]
    elif _type == 'deposit':
        return [f'deposit-schema-{perm}' for perm in perms]
    else:
        return [f'schema-object-{perm}' for perm in perms]


def _allow(action, arg, id):
    """Allow action for schema processor."""
    db.session.add(
        ActionRoles.allow(action, argument=arg, role_id=id)
    )


def _deny(action, arg, id):
    """Deny action for schema processor."""
    db.session.add(
        ActionRoles.deny(action, argument=arg, role_id=id)
    )


def _remove(action, arg, id):
    """Remove action for schema processor."""
    ActionRoles.query_by_action(action, argument=arg)\
        .filter(ActionRoles.role_id == id)\
        .delete(synchronize_session=False)


def process_action(schema_action, schema_name, actions_roles):
    """
    Permission process action. The schema_argument can be either a schema name
    or a schema id.
    """
    allowed_actions = current_app.extensions['invenio-access'].actions
    schema_actions = {
        'allow': _allow,
        'deny': _deny,
        'remove': _remove
    }
    schema = Schema.get_latest(schema_name)
    processor = schema_actions[schema_action]

    # check for kind of action, in order to use the correct argument
    # schema actions need id, deposit/record actions need name
    for _action, _role in actions_roles:
        try:
            with db.session.begin_nested():
                role_id = Role.query.filter_by(name=_role).one().id
                schema_argument = schema.id \
                    if _action.startswith('schema') else schema_name
                processor(allowed_actions[_action], schema_argument, role_id)
            db.session.commit()
        except IntegrityError:
            click.secho(
                f'Error during the assignment of {_action} to {_role}. '
                f'Combination already exists.', fg='red')

    click.secho('Process finished.', fg='green')
