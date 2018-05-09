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

"""CERN Analysis Preservation base configuration."""

from __future__ import absolute_import, print_function

import copy
import os
from os.path import dirname, join

from celery.schedules import crontab
from flask import request
from flask_principal import RoleNeed
from invenio_deposit import config as deposit_config
from invenio_deposit.config import DEPOSIT_REST_SORT_OPTIONS
from invenio_deposit.scopes import write_scope
from invenio_deposit.utils import check_oauth2_scope
from invenio_records_rest.config import (RECORDS_REST_ENDPOINTS,
                                         RECORDS_REST_FACETS,
                                         RECORDS_REST_SORT_OPTIONS)
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import allow_all, deny_all
from jsonresolver import JSONResolver
from jsonresolver.contrib.jsonref import json_loader_factory

from cap.modules.deposit.permissions import (CreateDepositPermission,
                                             DeleteDepositPermission,
                                             ReadDepositPermission,
                                             UpdateDepositPermission)
from cap.modules.oauthclient.contrib.cern import (account_info, account_setup,
                                                  disconnect_handler)
from cap.modules.oauthclient.rest_handlers import (authorized_signup_handler,
                                                   signup_handler)
from cap.modules.records.permissions import record_read_permission_factory
from cap.modules.records.search import cap_record_search_factory


def _(x):
    """Identity function for string extraction"""
    return x


DEBUG = True

if DEBUG:
    REST_ENABLE_CORS = True

# Path to app root dir
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

REQUIREJS_CONFIG = 'js/build.js'
SASS_BIN = 'node-sass'

# Cache
# =========
#: Cache key prefix
CACHE_KEY_PREFIX = "cache::"
#: Host
CACHE_REDIS_HOST = "localhost"
#: Port
CACHE_REDIS_PORT = 6379
#: DB
CACHE_REDIS_DB = 0
#: URL of Redis db.
CACHE_REDIS_URL = "redis://{0}:{1}/{2}".format(
    CACHE_REDIS_HOST, CACHE_REDIS_PORT, CACHE_REDIS_DB)
#: Default cache type.
CACHE_TYPE = "redis"
#: Default cache URL for sessions.
ACCESS_SESSION_REDIS_HOST = os.environ.get('APP_ACCESS_SESSION_REDIS_HOST',
                                           'localhost')
ACCOUNTS_SESSION_REDIS_URL = "redis://localhost:6379/2"
#: Cache for storing access restrictions
ACCESS_CACHE = 'cap.modules.cache:current_cache'

# Celery
# ======
#: Import modules
CELERY_IMPORTS = {
    'cap.modules.experiments.tasks.lhcb',
}
#: Scheduled tasks
CELERYBEAT_SCHEDULE = {
    'dump_lhcb_analyses_to_json': {
        'task':
            'cap.modules.experiments.tasks.lhcb.dump_lhcb_analyses_to_json',
        'schedule': crontab(minute=0, hour=2)
    },
}

# Mail
# ====
#: Regex for email
EMAIL_REGEX = '[^@]+@[^@]+\.[^@]+'
MAIL_SUPPRESS_SEND = True

# Language
# ========
#: Default language
BABEL_DEFAULT_LANGUAGE = 'en'
#: Default timezone
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
#: Other supported languages.
I18N_LANGUAGES = []

# Theme
# =====
#: Default site name.
THEME_SITENAME = _("CERN Analysis Preservation")
#: Google Site Verification ids.
THEME_GOOGLE_SITE_VERIFICATION = []

#: E-Groups for superuser rights
SUPERUSER_EGROUPS = [
    RoleNeed('analysis-preservation-support@cern.ch'),
    RoleNeed('data-preservation-admins@cern.ch'),
]

# CAP collaboration groups
# ========================
#: Configuration for collaborations
CAP_COLLAB_EGROUPS = {
    "CMS": [
        RoleNeed("cms-members@cern.ch"),
    ],
    "ALICE": [
        RoleNeed("alice-member@cern.ch"),
    ],
    "ATLAS": [
        RoleNeed("atlas-active-members-all@cern.ch"),
    ],
    "LHCb": [
        RoleNeed("lhcb-general@cern.ch"),
    ],
    "ADMIN": SUPERUSER_EGROUPS
}

# Records
# =======
# #: Records base template
# RECORDS_UI_BASE_TEMPLATE = 'invenio_deposit/base.html'
# #: Records configuration
# RECORDS_UI_DEFAULT_PERMISSION_FACTORY = "cap.modules.theme.permissions:" \
#     "read_permission_factory"

#: Records sort/facets options
RECORDS_REST_SORT_OPTIONS = dict(
    records=dict(
        bestmatch=dict(
            title=_('Best match'),
            fields=['_score'],
            default_order='desc',
            order=1,
        ),
        mostrecent=dict(
            title=_('Most recent'),
            fields=['created'],
            default_order='desc',
            order=2,
        ),
    )
)
RECORDS_REST_SORT_OPTIONS.update(DEPOSIT_REST_SORT_OPTIONS)

#: Record search facets.
RECORDS_REST_FACETS = {
    'deposits': {
        'aggs': {
            'type': {
                'terms': {
                    'field': '_type',
                },
            },
            'status': {
                'terms': {
                    'field': '_deposit.status',
                },
            },
            'cadi_status': {
                'terms': {
                    'field': 'cadi_info.status',
                },
            },
            'sources': {
                'terms': {
                    'field': 'cadi_info.sources',
                },
            },
            'conference': {
                'terms': {
                    'field': 'cadi_info.conference',
                },
            },
            'software': {
                'terms': {
                    'field': 'basic_info.software.name',
                },
            },
            'triggers': {
                'terms': {
                    'field': 'selection_triggers.trigger',
                },
            },
        },
        'post_filters': {
            'type': terms_filter('_type'),
            'status': terms_filter('_deposit.status'),
            'cadi_status': terms_filter('cadi_info.status'),
            'sources': terms_filter('cadi_info.sources'),
            'conference': terms_filter('cadi_info.conference'),
            'software': terms_filter('basic_info.software.name'),
            'triggers': terms_filter('selection_triggers.trigger')
        },
    },
}

# RECORDS_REST_FACETS.update(DEPOSIT_REST_FACETS)

# #: Endpoints for displaying records.
# RECORDS_UI_ENDPOINTS = dict(
#     recid=dict(
#         pid_type='recid',
#         route='/records/<pid_value>',
#         template='invenio_records_ui/detail.html',
#         record_class='invenio_records_files.api:Record'
#     ),
#     recid_preview=dict(
#         pid_type='recid',
#         route='/records/<pid_value>/preview/<path:filename>',
#         view_imp='invenio_previewer.views.preview',
#         record_class='invenio_records_files.api:Record',
#     ),
#     recid_files=dict(
#         pid_type='recid',
#         route='/records/<pid_value>/files/<path:filename>',
#         view_imp='invenio_records_files.utils.file_download_ui',
#         record_class='invenio_records_files.api:Record',
#     ),
# )

#: Records REST API endpoints.
RECORDS_REST_ENDPOINTS = copy.deepcopy(RECORDS_REST_ENDPOINTS)
RECORDS_REST_ENDPOINTS['recid'].update({
    # pid_type='recid',
    'pid_minter': 'cap_record_minter',
    'pid_fetcher': 'cap_record_fetcher',
    # 'search_index': 'records',
    # 'record_class': "invenio_records_files.api:Record",
    # search_type=None,
    'search_class': cap_record_search_factory(
        CAP_COLLAB_EGROUPS,
        SUPERUSER_EGROUPS,
    ),
    # 'search_factory_imp': 'invenio_records_rest.query.es_search_factory',
    'record_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':json_v1_response'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_response')
    },
    'search_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search'),
    },
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: record_read_permission_factory(
            CAP_COLLAB_EGROUPS,
            SUPERUSER_EGROUPS)(record).can(),
        write_scope.id),
})

#: Default api endpoint for LHCb db
GRAPHENEDB_URL = 'http://datadependency.cern.ch:7474'

#: Account-REST Configuration
ACCOUNTS_REST_READ_ROLE_PERMISSION_FACTORY = deny_all
"""Default get role permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_ROLE_PERMISSION_FACTORY = deny_all
"""Default update role permission factory: reject any request."""

ACCOUNTS_REST_DELETE_ROLE_PERMISSION_FACTORY = deny_all
"""Default delete role permission factory: reject any request."""

ACCOUNTS_REST_READ_ROLES_LIST_PERMISSION_FACTORY = deny_all
"""Default list roles permission factory: reject any request."""

ACCOUNTS_REST_CREATE_ROLE_PERMISSION_FACTORY = deny_all
"""Default create role permission factory: reject any request."""

ACCOUNTS_REST_ASSIGN_ROLE_PERMISSION_FACTORY = deny_all
"""Default assign role to user permission factory: reject any request."""

ACCOUNTS_REST_UNASSIGN_ROLE_PERMISSION_FACTORY = deny_all
"""Default unassign role from user permission factory: reject any request."""

ACCOUNTS_REST_READ_USER_ROLES_LIST_PERMISSION_FACTORY = deny_all
"""Default list users roles permission factory: reject any request."""

ACCOUNTS_REST_READ_USER_PROPERTIES_PERMISSION_FACTORY = allow_all
"""Default read user properties permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_USER_PROPERTIES_PERMISSION_FACTORY = deny_all
"""Default modify user properties permission factory: reject any request."""

ACCOUNTS_REST_READ_USERS_LIST_PERMISSION_FACTORY = allow_all
"""Default list users permission factory: reject any request."""

# Search
# ======
#: Default API endpoint for search UI.
SEARCH_UI_SEARCH_API = '/api/deposits/'

#: Templates
SEARCH_UI_SEARCH_TEMPLATE = "cap_search_ui/search.html"
SEARCH_UI_JSTEMPLATE_RESULTS = 'templates/cap_search_ui/results.html'
# SEARCH_UI_JSTEMPLATE_FACETS = "templates/cap_search_ui/facets.html"

#: Default ElasticSearch hosts
SEARCH_ELASTIC_HOSTS = ["localhost:9200"]

#: Search query enhancers
SEARCH_QUERY_ENHANCERS = [
    'cap.modules.access.ext:authenticated_query'
]

# Admin
# ========
ADMIN_PERMISSION_FACTORY = 'cap.modules.access.permissions.admin_permission_factory'

# Accounts
# ========
#: Login registration template.
# OAUTHCLIENT_LOGIN_USER_TEMPLATE = "access/login_user.html"
#: Login confirmation mail.
SECURITY_SEND_REGISTER_EMAIL = False

ACCOUNTS_REGISTER_BLUEPRINT = None
SECURITY_RECOVERABLE = False
SECURITY_REGISTERABLE = False
SECURITY_CHANGEABLE = False
SECURITY_CONFIRMABLE = False
BLUEPRINT_NAME = 'cap_theme'

# Logging
# =======
#: CERN OAuth configuration
CERN_APP_CREDENTIALS = {
    'consumer_key': os.environ.get('APP_CERN_APP_CREDENTIALS_KEY'),
    'consumer_secret': os.environ.get('APP_CERN_APP_CREDENTIALS_SECRET')
}

# OAUTHCLIENT_REMOTE_APPS = {'cern': cern.REMOTE_APP}

OAUTHCLIENT_REMOTE_APPS = {
    'cern': dict(
        title='CERN',
        description='Connecting to CERN Organization.',
        icon='',
        authorized_handler=authorized_signup_handler,
        disconnect_handler=disconnect_handler,
        signup_handler=dict(
            info=account_info,
            setup=account_setup,
            view=signup_handler,
        ),
        params=dict(
            base_url='https://oauth.web.cern.ch/',
            request_token_url=None,
            access_token_url='https://oauth.web.cern.ch/OAuth/Token',
            access_token_method='POST',
            authorize_url='https://oauth.web.cern.ch/OAuth/Authorize',
            app_key='CERN_APP_CREDENTIALS',
            content_type='application/json',
            request_token_params={'scope': 'Name Email Bio Groups',
                                  'show_login': 'true'}
        )
    )
}
#: OAuth login template.
# OAUTHCLIENT_LOGIN_USER_TEMPLATE = 'access/login_user.html'

# JSON Schemas
# ============
#: Hostname for JSON Schemas.
JSONSCHEMAS_HOST = os.environ.get('APP_JSONSCHEMAS_HOST', 'localhost:5000')
#: Path to where JSON metadata exist
JSON_METADATA_PATH = "/_metadata"
JSONSCHEMAS_ENDPOINT = '/schemas'

JSONSCHEMAS_RESOLVE_SCHEMA = True

JSONSCHEMAS_LOADER_CLS = json_loader_factory(JSONResolver(
    plugins=[
        'cap.modules.records.resolvers.local',
        'cap.modules.records.resolvers.cap',
    ],
))

# JSONSCHEMAS_VERSIONS = {
#     "ATLASAnalysis": "ATLASAnalysis-v0.0.1",
#     "ATLASWorkflows": "ATLASWorkflows-v0.0.1",
#     "CMSAnalysis": "CMSAnalysis-v0.0.1",
#     "CMSQuestionnaire": "CMSQuestionnaire-v0.0.1",
#     "LHCbAnalysis": "LHCbAnalysis-v0.0.1",
# }

JSONSCHEMAS_ROOT = os.path.join(APP_ROOT, 'jsonschemas')

# directories with jsonschemas
JSONSCHEMAS_DEPOSIT_DIR = 'deposits/records/'
JSONSCHEMAS_RECORDS_DIR = 'records/'

CAP_COLLECTION_TO_DOCUMENT_TYPE = {
    'ATLASAnalysis': 'ATLAS Analysis',
    'ATLASWorkflows': 'ATLAS Workflows',
    'CMSAnalysis': 'CMS Analysis',
    'CMSQuestionnaire': 'CMS Questionnaire',
    'LHCbAnalysis': "LHCb Analysis",
}

# WARNING: Do not share the secret key - especially do not commit it to
# version control.
SECRET_KEY = "changeme"

# Database
# ============
SQLALCHEMY_DATABASE_URI = "postgresql://cap:cap@localhost:5432/cap"

# Ana's database
LHCB_ANA_DB = 'http://datadependency.cern.ch'
LHCB_GETCOLLISIONDATA_URL = '{0}/getRecoStripSoft?propass='.format(LHCB_ANA_DB)
LHCB_GETPLATFORM_URL = '{0}/getPlatform?app='.format(LHCB_ANA_DB)

# CADI database
# @TOFIX should this be public?
CADI_API_URL = 'http://vocms0190.cern.ch/tools/api'
CADI_GET_CHANGES_URL = '{0}/updatedCadiLines/'.format(CADI_API_URL)
CADI_GET_ALL_URL = '{0}/viewCadiLines'.format(CADI_API_URL)
CADI_GET_RECORD_URL = '{0}/cadiLine/'.format(CADI_API_URL)

# Deposit
# ============
#: Default base template for deposit
#: -- removes <html>,<body>,etc unneeded tags
# DEPOSIT_BASE_TEMPLATE = 'invenio_deposit/base.html'
#: Default jsonschema for deposit
DEPOSIT_DEFAULT_JSONSCHEMA = 'deposits/records/lhcb-v0.0.1.json'
#: Default schemanform for deposit
DEPOSIT_DEFAULT_SCHEMAFORM = 'json/deposits/records/lhcb-v0.0.1.json'
#: Search api url for deposit
DEPOSIT_SEARCH_API = '/api/deposits/'
#: Files api url for deposit
DEPOSIT_FILES_API = '/api/files'
#: Template for deposit records API.
# DEPOSIT_RECORDS_API = '/api/deposit/depositions/{pid_value}'

DEPOSIT_GROUPS = {
    "lhcb": {
        "experiment": "LHCb",
        "schema": "schemas/deposits/records/lhcb-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/lhcb-v0.0.1.json",
        "name": "LHCb Analysis",
        "description": "Create an LHCb Analysis (analysis metadata, workflows, etc)",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.lhcb.lhcb_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "cms-analysis": {
        "experiment": "CMS",
        "schema": "schemas/deposits/records/cms-analysis-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/cms-analysis-v0.0.1.json",
        "name": "CMS Analysis",
        "description":
            "Create a CMS Analysis (analysis metadata, workflows, etc)",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.cms.cms_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "cms-cadi": {
        "experiment": "CMS",
        "schema": "schemas/deposits/records/cms-cadi-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/cms-cadi-v0.0.1.json",
        "name": "CMS CADI Entries",
        "description":
            "Create a CMS CADI Entry",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.common.superuser_needs',
        'read_permission_factory_imp':
             'cap.modules.experiments.permissions.cms.cms_group_need',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "cms-questionnaire": {
        "experiment": "CMS",
        "schema": "schemas/deposits/records/cms-questionnaire-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/cms-questionnaire-v0.0.1.json",
        "name": "CMS Questionnaire",
        "description": "Create a CMS Questionnaire",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.cms.cms_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "atlas-workflows": {
        "experiment": "ATLAS",
        "schema": "schemas/deposits/records/atlas-workflows-v0.0.1.json",
        "schema_form":
            "/schemas/options/deposits/records/atlas-workflows-v0.0.1.json",
        "name": "ATLAS Workflow",
        "description": "Create an ATLAS Workflow",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.atlas.atlas_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "atlas-analysis": {
        "experiment": "ATLAS",
        "schema": "schemas/deposits/records/atlas-analysis-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/atlas-analysis-v0.0.1.json",
        "name": "ATLAS Analysis",
        "description": "Create an ATLAS Analysis",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.atlas.atlas_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "alice-analysis": {
        "experiment": "ALICE",
        "schema": "schemas/deposits/records/alice-analysis-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/alice-analysis-v0.0.1.json",
        "name": "ALICE Analysis",
        "description": "Create an ALICE Analysis",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.alice.alice_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "cms-auxiliary-measurement": {
        "experiment": "CMS",
        "schema": "schemas/deposits/records/cms-auxiliary-measurements-v0.0.1.json",
        "schema_form": "/schemas/options/deposits/records/cms-auxiliary-measurements-v0.0.1.json",
        "name": "CMS Auxiliary Measurement",
        "description": "Create a CMS Auxiliary Measurement",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.cms.cms_group_need',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    },
    "test-schema": {
        "experiment": "TEST",
        "schema": "schemas/deposits/records/test-schema-v0.0.1.json",
        "schema_form": "",
        "name": "Test schema",
        "description":
            "Create a CMS CADI Entry",
        # "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        'create_permission_factory_imp':
            'cap.modules.experiments.permissions.common.superuser_needs',
        # 'read_permission_factory_imp':
        #     'cap.modules.deposit.permissions.read_permission_factory',
        # 'update_permission_factory_imp':
        #     'cap.modules.deposit.permissions.update_permission_factory',
    }
}

# #: Endpoints for deposit.
DEPOSIT_UI_ENDPOINT = None
DEPOSIT_REST_ENDPOINTS = copy.deepcopy(deposit_config.DEPOSIT_REST_ENDPOINTS)
_PID = 'pid(depid,record_class="cap.modules.deposit.api:CAPDeposit")'

# DEPOSIT_PID = 'pid(dep,record_class="cap.modules.deposit.api:CapDeposit")'
DEPOSIT_REST_ENDPOINTS['depid'].update({
    # 'pid_type': 'depid',
    # 'pid_minter': 'cap_deposit_minter',
    # 'pid_fetcher': 'cap_deposit_fetcher',
    'record_class': 'cap.modules.deposit.api:CAPDeposit',
    'record_loaders': {
        'application/json': 'cap.modules.deposit.loaders:json_v1_loader',
        'application/json-patch+json': lambda: request.get_json(force=True),
    },
    'record_serializers': {
        'application/json': (
            'cap.modules.records.serializers'
            ':json_v1_response'),
        'application/basic+json': (
            'cap.modules.records.serializers'
            ':basic_json_v1_response'),
        'application/permissions+json': (
            'cap.modules.records.serializers'
            ':permissions_json_v1_response'
        )
    },
    'search_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search')
    },
    'files_serializers': {
        'application/json': (
            'cap.modules.records.serializers'
            ':deposit_v1_files_response'),
    },
    'search_class': 'cap.modules.deposit.search:DepositSearch',
    # 'search_factory_imp': 'cap.modules.deposit.query.search_factory',
    'item_route': '/deposits/<{0}:pid_value>'.format(_PID),
    'file_list_route': '/deposits/<{0}:pid_value>/files'.format(_PID),
    'file_item_route':
        '/deposits/<{0}:pid_value>/files/<path:key>'.format(_PID),
    'create_permission_factory_imp': check_oauth2_scope(
        lambda record: CreateDepositPermission(record).can(),
        write_scope.id),
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: ReadDepositPermission(record).can(),
        write_scope.id),
    'update_permission_factory_imp': check_oauth2_scope(
        lambda record: UpdateDepositPermission(record).can(),
        write_scope.id),
    # TODO update delete permission when 'discard'/'delete' is ready
    'delete_permission_factory_imp': check_oauth2_scope(
        lambda record: DeleteDepositPermission(record).can(),
        write_scope.id),
    'links_factory_imp': 'cap.modules.deposit.links:links_factory',
})
# DEPOSIT_UI_INDEX_TEMPLATE = "cap_deposit/index.html"
# TODO Resolve when '/deposit/new/' is removed
DEPOSIT_RECORDS_UI_ENDPOINTS = copy.deepcopy(
    deposit_config.DEPOSIT_RECORDS_UI_ENDPOINTS)

DEPOSIT_RECORDS_UI_ENDPOINTS['depid'].update({
    'template': 'cap_deposit/edit.html',
    'permission_factory_imp': "cap.modules.deposit.permissions:ReadDepositPermission",
})

#: Template for <invenio-records-form>
DEPOSIT_FORM_TEMPLATES = {
    "array": "array.html",
    "button": "button.html",
    "default": "default.html",
    "number": "default.html",
    "fieldset": "fieldset.html",
    "radios": "radios.html",
    "radios_inline": "radios_inline.html",
    "select": "select.html",
    "textarea": "textarea.html",
    "tabarray": "tabarray.html",
    "checkboxes": "checkboxes.html"
}

DEPOSIT_UI_JSTEMPLATE_FORM = 'templates/cap_records_js/form.html'

DEPOSIT_FORM_TEMPLATES_BASE = 'templates/cap_records_js/decorators'

#: Response messages for deposit
DEPOSIT_RESPONSE_MESSAGES = dict(
    self=dict(
        message="Saved successfully."
    ),
    delete=dict(
        message="Deleted succesfully."
    ),
    discard=dict(
        message="Changes discarded succesfully."
    ),
    publish=dict(
        message="Record shared succesfully."
    ),
    edit=dict(
        message="Edited succesfully."
    ),
    clone=dict(
        message="Analysis cloned succesfully."
    ),
)

# Datadir
# =======
DATADIR = join(dirname(__file__), 'data')

# Files
# ===========
# TOFIX: Fix to check '$schema' permissions( like
#        'UpdateDepositPermission') for file upload
FILES_REST_PERMISSION_FACTORY = allow_all

# Indexer
# =======
#: Flag for not replacing refs when creating deposit
INDEXER_REPLACE_REFS = False

# LHCB DB files location
# ======================
LHCB_DB_FILES_LOCATION = os.path.join(APP_ROOT,
                                      'modules/experiments/static/example_lhcb/')

# Disable JWT token
ACCOUNTS_JWT_ENABLE = False

# Github and Gitlab oauth tokens
# ==============================
GITHUB_OAUTH_ACCESS_TOKEN = os.environ.get(
    'APP_GITHUB_OAUTH_ACCESS_TOKEN', None)
GITLAB_OAUTH_ACCESS_TOKEN = os.environ.get(
    'APP_GITLAB_OAUTH_ACCESS_TOKEN', None)
