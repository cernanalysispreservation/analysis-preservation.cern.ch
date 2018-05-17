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


"""CAP Deposit permissions."""

from functools import partial

from flask import current_app, g, request
from invenio_access.permissions import ParameterizedActionNeed, Permission

from cap.utils import obj_or_import_string

from .utils import discover_schema
from .errors import WrongJSONSchemaError, EmptyDepositError

DepositReadActionNeed = partial(ParameterizedActionNeed, 'deposit-read')
"""Action need for reading a record."""

DepositAdminActionNeed = partial(ParameterizedActionNeed, 'deposit-admin')
"""Action need for creating a record."""

DepositUpdateActionNeed = partial(ParameterizedActionNeed, 'deposit-update')
"""Action need for updating a record."""

DepositDeleteActionNeed = partial(ParameterizedActionNeed, 'deposit-delete')
"""Action need for deleting a record."""


def deposit_read_need(record):
    return DepositReadActionNeed(str(record.id))


def deposit_admin_need(record):
    return DepositAdminActionNeed(str(record.id))


def deposit_update_need(record):
    return DepositUpdateActionNeed(str(record.id))


def deposit_delete_need(record):
    return DepositDeleteActionNeed(str(record.id))


class DepositPermission(Permission):
    """Generic deposit permission."""
    actions = {
        "read": deposit_read_need,
        "update": deposit_update_need,
        "admin": deposit_admin_need,
    }

    def __init__(self, record, action):
        """Constructor.
        Args:
            deposit: deposit to which access is requested.
        """
        if action == 'create' and record == {}:
            raise EmptyDepositError()

        _needs = set()
        self.deposit = record
        self.action = action
        if action in self.actions:
            _needs.add(self.actions[action](record))

        self._needs = _needs

        self._load_deposit_group_permissions()

        super(DepositPermission, self).__init__(*_needs)

    def _load_deposit_group_permissions(self):

        _deposit_group = self._get_deposit_group_info()

        if not _deposit_group:
            raise WrongJSONSchemaError()

        _permission_factory_imp = \
            _deposit_group.get(self.action + '_permission_factory_imp', None)

        _permission_factory_imp = \
            obj_or_import_string(_permission_factory_imp)

        if _permission_factory_imp:
            for _need in _permission_factory_imp:
                self._needs.add(_need)

    def _get_deposit_group_info(self):
        """Retrieve deposit group information for specific schema"""

        self.deposit['$schema'] = discover_schema(self.deposit)

        try:
            schema = self.deposit.get("$schema", None) \
                                 .split('/schemas/', 1)[1]
        except (IndexError, AttributeError):
            raise WrongJSONSchemaError()

        _deposit_group = \
            next(
                (depgroup
                 for dg, depgroup
                 in current_app.config.get('DEPOSIT_GROUPS').iteritems()
                 if schema in depgroup['schema']
                 ),
                None
            )

        return _deposit_group

    def allows(self, identity):
        """Whether the identity can access this permission.

        :param identity: The identity
        """
        owners = self.deposit.get('_deposit', {}).get('owners', [])
        superuser_egroups = current_app.config.get('SUPERUSER_EGROUPS', [])
        # Check if the user is superuser
        for superuser_egroup in superuser_egroups:
            if superuser_egroup in identity.provides:
                return True
        # Check if the user is the owner of the record
        if identity.id in owners:
            return True

        return super(DepositPermission, self).allows(identity)

    def can(self):
        owners = self.deposit.get('_deposit', {}).get('owners', [])
        superuser_egroups = current_app.config.get('SUPERUSER_EGROUPS', [])
        # Check if the user is superuser
        for superuser_egroup in superuser_egroups:
            if superuser_egroup in g.identity.provides:
                return True
        if g.identity.id in owners:
            return True

        return super(DepositPermission, self).can()


class UpdateDepositPermission(DepositPermission):
    """Deposit update permission"""

    def __init__(self, record):
        super(UpdateDepositPermission, self).__init__(record, 'update')


class CreateDepositPermission(DepositPermission):
    """Deposit update permission"""

    def __init__(self, record):
        # Get payload and pass it as record to get the '$schema'
        record = request.get_json(force=True)

        super(CreateDepositPermission, self).__init__(record, 'create')


class ReadDepositPermission(DepositPermission):
    """Deposit read permission"""

    def __init__(self, record):
        super(ReadDepositPermission, self).__init__(record, 'read')


class DeleteDepositPermission(DepositPermission):
    """Deposit delete permission"""

    def __init__(self, record):
        super(DeleteDepositPermission, self).__init__(record, 'delete')


def read_permission_factory(record):
    return Permission(deposit_read_need(record.id))


def admin_permission_factory(record):
    return Permission(deposit_admin_need(record.id))


def update_permission_factory(record):
    return Permission(deposit_update_need(record.id))


def delete_permission_factory(record):
    return Permission(deposit_delete_need(record.id))
