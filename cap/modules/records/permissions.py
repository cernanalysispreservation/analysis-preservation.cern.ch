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

from flask import current_app, request

from invenio_access.permissions import ParameterizedActionNeed, Permission

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
    """Generic deposit permission."""

    actions = {
        "read": record_read_need,
        "update": record_update_need,
        "admin": record_admin_need,
    }

    def __init__(self, record, action):
        """Constructor.

        Args:
            deposit: deposit to which access is requested.
        """
        _needs = set()
        _needs.add(self.actions['admin'](record))

        if action in self.actions:
            _needs.add(self.actions[action](record))

        self._needs.update(_needs)

        super(RecordPermission, self).__init__(*self._needs)


class CreateRecordPermission(Permission):
    """Deposit create permission."""

    def __init__(self, record):
        """Initialize state."""
        record = request.get_json(force=True)

        super(CreateRecordPermission, self).__init__(record, 'create')


class ReadRecordPermission(RecordPermission):
    """Deposit read permission."""

    def __init__(self, record):
        """Initialize state."""
        self._needs = set()

        exp_needs = current_app.config['EXPERIMENT_NEEDS'].get(
            record['_experiment'], [])
        self._needs.update(exp_needs)

        super(ReadRecordPermission, self).__init__(record, 'read')


class UpdateRecordPermission(RecordPermission):
    """Deposit update permission."""

    def __init__(self, record):
        """Initialize state."""
        super(UpdateRecordPermission, self).__init__(record, 'update')


class DeleteRecordPermission(RecordPermission):
    """Deposit delete permission."""

    def __init__(self, record):
        """Initialize state."""
        super(DeleteRecordPermission, self).__init__(record, 'delete')


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
