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

from flask_principal import RoleNeed
from invenio_access.permissions import Permission

from .utils import path_value_equals


def equals(record, path, value):
    data = path_value_equals(path, record)
    return True if data and data == value else False


def exists(record, path, value):
    data = path_value_equals(path, record)
    return True if data else False


def is_in(record, path, value):
    data = path_value_equals(path, record)
    return True if data and value in data else False


def is_not_in(record, path, value):
    data = path_value_equals(path, record)
    return True if data and value not in data else False


def has_permission(record, path, value):
    return Permission(RoleNeed(value)).can()


CONDITION_METHODS = {
    # conditions
    'equals': equals,
    'exists': exists,
    'is_in': is_in,
    'is_not_in': is_not_in,
    # mail
    'has_permission': has_permission
}
