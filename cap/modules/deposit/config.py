# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.
"""Deposit configuration for CERN Analysis Preservation."""

from __future__ import absolute_import, print_function

import copy

from flask import request

from cap.modules.deposit.permissions import (AdminDepositPermission,
                                             CreateDepositPermission,
                                             ReadDepositPermission)
from invenio_deposit import config as deposit_config

from invenio_deposit.scopes import write_scope
from invenio_deposit.utils import check_oauth2_scope

from invenio_records_rest.utils import allow_all

# Deposit
# ============
#: Default jsonschema for deposit
DEPOSIT_DEFAULT_JSONSCHEMA = 'deposits/records/lhcb-v0.0.1.json'
#: Default schemanform for deposit
DEPOSIT_DEFAULT_SCHEMAFORM = 'json/deposits/records/lhcb-v0.0.1.json'
#: Search api url for deposit
DEPOSIT_SEARCH_API = '/api/deposits'
#: Files api url for deposit
DEPOSIT_FILES_API = '/api/files'

DEPOSIT_PID_MINTER = 'cap_record_minter'

DEPOSIT_REST_ENDPOINTS = copy.deepcopy(deposit_config.DEPOSIT_REST_ENDPOINTS)
_PID = 'pid(depid,record_class="cap.modules.deposit.api:CAPDeposit")'

DEPOSIT_UI_SEARCH_INDEX = '*'

# DEPOSIT_PID_MINTER is used on publish method in deposit class
DEPOSIT_REST_ENDPOINTS['depid'].update({
    'pid_type': 'depid',
    'pid_minter': 'cap_deposit_minter',
    'pid_fetcher': 'cap_deposit_fetcher',
    'record_class': 'cap.modules.deposit.api:CAPDeposit',
    'record_loaders': {
        'application/json': 'cap.modules.deposit.loaders:json_v1_loader',
        'application/json-patch+json': lambda: request.get_json(force=True),
    },
    'record_serializers': {
        'application/json': ('cap.modules.deposit.serializers'
                             ':deposit_json_v1_response'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_response'),
        'application/permissions+json': ('cap.modules.records.serializers'
                                         ':permissions_json_v1_response'),
        'application/form+json': ('cap.modules.deposit.serializers'
                                  ':deposit_form_json_v1_response')
    },
    'search_serializers': {
        'application/json': ('cap.modules.deposit.serializers'
                             ':deposit_json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search')
    },
    'files_serializers': {
        'application/json': ('cap.modules.deposit.serializers:files_response'),
    },
    'search_class': 'cap.modules.deposit.search:CAPDepositSearch',
    'search_factory_imp': 'cap.modules.search.query:cap_search_factory',
    'item_route': '/deposits/<{0}:pid_value>'.format(_PID),
    'file_list_route': '/deposits/<{0}:pid_value>/files'.format(_PID),
    'file_item_route':
        '/deposits/<{0}:pid_value>/files/<path:key>'.format(_PID),
    'create_permission_factory_imp': check_oauth2_scope(
        lambda record: CreateDepositPermission(record).can(), write_scope.id),
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: ReadDepositPermission(record).can(), write_scope.id),
    'update_permission_factory_imp': allow_all,
    'delete_permission_factory_imp': check_oauth2_scope(
        lambda record: AdminDepositPermission(record).can(), write_scope.id),
    'links_factory_imp': 'cap.modules.deposit.links:links_factory',
})
