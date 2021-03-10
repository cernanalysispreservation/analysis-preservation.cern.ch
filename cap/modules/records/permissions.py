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
"""CAP Record permissions."""

from functools import partial

from flask import request
from invenio_access.permissions import ParameterizedActionNeed, Permission

from cap.modules.schemas.permissions import exp_need_factory, \
    record_schema_admin_action, record_schema_delete_action,\
    record_schema_read_action, record_schema_update_action
from cap.modules.schemas.resolvers import resolve_schema_by_url


RecordReadActionNeed = partial(ParameterizedActionNeed, 'record-read')
"""Action need for reading a record."""

RecordAdminActionNeed = partial(ParameterizedActionNeed, 'record-admin')
"""Action need for creating a record."""

RecordUpdateActionNeed = partial(ParameterizedActionNeed, 'record-update')
"""Action need for updating a record."""

RecordDeleteActionNeed = partial(ParameterizedActionNeed, 'record-delete')
"""Action need for deleting a record."""


def record_read_need(record):
    """Record read action."""
    return RecordReadActionNeed(str(record.id))


def record_admin_need(record):
    """Record admin action."""
    return RecordAdminActionNeed(str(record.id))


def record_update_need(record):
    """Record update action."""
    return RecordUpdateActionNeed(str(record.id))


def record_delete_need(record):
    """Record delete action."""
    return RecordDeleteActionNeed(str(record.id))


class RecordPermission(Permission):
    """Generic record permission."""

    actions = {
        "read": record_read_need,
        "update": record_update_need,
        "admin": record_admin_need,
    }

    schema_actions = {
        "read": record_schema_read_action,
        "update": record_schema_update_action,
        "delete": record_schema_delete_action,
        "admin": record_schema_admin_action,
    }

    def __init__(self, record, action, extra_needs=None):
        """Constructor.

        Args:
            record: record to which access is requested.
        """
        _needs = set()
        _needs.add(self.actions['admin'](record))

        if extra_needs:
            _needs.update(extra_needs)

        if action in self.actions:
            _needs.add(self.actions[action](record))

        if action in self.schema_actions:
            _needs.add(self.schema_actions[action](
                resolve_schema_by_url(record['$schema']).name
            ))

        super(RecordPermission, self).__init__(*_needs)


class CreateRecordPermission(Permission):
    """Record create permission."""
    def __init__(self, record):
        """Initialize state."""
        record = request.get_json(force=True)

        super(CreateRecordPermission, self).__init__(record, 'create')


class ReadRecordPermission(RecordPermission):
    """Record read permission."""
    def __init__(self, record):
        """Initialize state."""
        super(ReadRecordPermission, self).__init__(record, 'read')


class UpdateRecordPermission(RecordPermission):
    """Record update permission."""
    def __init__(self, record):
        """Initialize state."""
        super(UpdateRecordPermission, self).__init__(record, 'update')


class DeleteRecordPermission(RecordPermission):
    """Record delete permission."""
    def __init__(self, record):
        """Initialize state."""
        super(DeleteRecordPermission, self).__init__(record, 'delete')


class AdminRecordPermission(RecordPermission):
    """Record admin permission."""
    def __init__(self, record):
        """Initialize state."""
        super(AdminRecordPermission, self).__init__(record, 'admin')


def read_permission_factory(record):
    """Read permission factory."""
    return Permission(record_read_need(record.id))


def update_permission_factory(record):
    """Update permission factory."""
    return Permission(record_update_need(record.id))


def delete_permission_factory(record):
    """Delete permission factory."""
    return Permission(record_delete_need(record.id))


def admin_permission_factory(record):
    """Admin permission factory."""
    return Permission(record_admin_need(record.id))


class RecordFilesPermission(Permission):
    """Permission for files in records (read and update access)."""

    access_actions = {
        'read': [
            'bucket-read',
            'bucket-read-versions',
            'object-read',
            'object-read-version',
            'multipart-read',
        ],
        'update': [
            'bucket-read',
            'bucket-read-versions',
            'object-read',
            'object-read-version',
            'multipart-read',
            'bucket-update',
            'bucket-listmultiparts',
            'object-delete',
            'object-delete-version',
            'multipart-delete',
        ]
    }

    access_needs = {
        "read": record_read_need,
        "update": record_update_need,
        "admin": record_admin_need,
    }

    def __init__(self, record, action):
        """Constructor.

        Args:
            record: record to which access is requested.
        """
        _needs = set()
        _needs.add(self.access_needs['admin'](record))
        exp = record.json.get('_experiment')

        if exp:
            _needs.add(exp_need_factory(exp))

        for access, actions in self.access_actions.items():
            if action in actions:
                _needs.add(self.access_needs[access](record))

        super(RecordFilesPermission, self).__init__(*_needs)
