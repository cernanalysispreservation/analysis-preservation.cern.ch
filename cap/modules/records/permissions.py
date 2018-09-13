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

from flask import current_app, request, g, abort

from cap.utils import obj_or_import_string
from cap.modules.schemas.models import Schema

from invenio_access.permissions import (
    DynamicPermission, ParameterizedActionNeed)

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


class RecordPermission(DynamicPermission):
    """Generic deposit permission."""

    actions = {
        "read": record_read_need,
        "update": record_update_need,
        "admin": record_admin_need,
    }

    def __init__(self, record, action, exp_needs=None, admin_needs=None):
        """Constructor.

        Args:
            deposit: deposit to which access is requested.
        """
        self.record = record
        self.action = action
        self.exp_needs = exp_needs
        self._needs = set()

        self._load_record_group_permissions()

        super(RecordPermission, self).__init__(*self._needs)

    def _load_record_group_permissions(self):
        _record_group = self._get_record_group_info()

        if _record_group:
            _permission_factory_imp = \
                obj_or_import_string(_record_group)

            if _permission_factory_imp:
                for _need in _permission_factory_imp:
                    self._needs.add(_need)
        else:
            abort(403)

    def _get_record_group_info(self):
        """Retrieve deposit group information for specific schema."""
        try:
            schema = self.record \
                .get("$schema", None).split('/schemas/', 1)[1]
        except (IndexError, AttributeError):
            return None

        obj = Schema.get_by_fullstring(schema)

        _record_group = current_app.config.get(
            'EXPERIMENT_PERMISSION', {})[obj.experiment]

        return _record_group

    def allows(self, identity):
        """Whether the identity can access this permission.

        :param identity: The identity
        """
        owners = self.record.get('_deposit', {}).get('owners', [])
        superuser_egroups = current_app.config.get('SUPERUSER_EGROUPS', [])
        # Check if the user is superuser
        for superuser_egroup in superuser_egroups:
            if superuser_egroup in identity.provides:
                return True
        # Check if the user is the owner of the record
        if identity.id in owners:
            return True

        return super(RecordPermission, self).allows(identity)

    def can(self):
        """Whether user is in the owners of the deposit."""
        owners = self.record.get('_deposit', {}).get('owners', [])

        if g.identity.id in owners:
            return True

        return super(RecordPermission, self).can()


class UpdateRecordPermission(RecordPermission):
    """Deposit update permission."""

    def __init__(self, record):
        """Initialize state."""
        super(UpdateRecordPermission, self).__init__(record, 'update')


class CreateRecordPermission(RecordPermission):
    """Deposit create permission."""

    def __init__(self, record):
        """Initialize state."""
        # Get payload and pass it as record to get the '$schema'
        record = request.get_json(force=True)
        super(CreateRecordPermission, self).__init__(record, 'create')


def record_read_permission_factory(exp_needs, admin_needs):
    """Record permission factory method."""
    class ReadRecordPermission(RecordPermission):
        """Deposit read permission."""

        def __init__(self, record):
            """Initialize state."""
            super(ReadRecordPermission, self).__init__(
                record, 'read', exp_needs, admin_needs)

    return ReadRecordPermission


class ReadRecordPermission(RecordPermission):
    """Deposit read permission."""

    def __init__(self, record):
        """Initialize state."""
        super(ReadRecordPermission, self).__init__(record, 'read')


class DeleteRecordPermission(RecordPermission):
    """Deposit delete permission."""

    def __init__(self, record):
        """Initialize state."""
        super(DeleteRecordPermission, self).__init__(record, 'delete')


def read_permission_factory(record):
    """Read permission factory."""
    return DynamicPermission(record_read_need(record.id))


def admin_permission_factory(record):
    """Admin permission factory."""
    return DynamicPermission(record_admin_need(record.id))


def update_permission_factory(record):
    """Update permission factory."""
    return DynamicPermission(record_update_need(record.id))


def delete_permission_factory(record):
    """Delete permission factory."""
    return DynamicPermission(record_delete_need(record.id))
