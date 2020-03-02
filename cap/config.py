# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.
"""Default configuration for CERN Analysis Preservation."""

from __future__ import absolute_import, print_function

import os
from datetime import timedelta
from os.path import dirname, join

import requests
from flask_principal import RoleNeed
from invenio_oauthclient.contrib.cern import REMOTE_APP as CERN_REMOTE_APP
from invenio_records_rest.utils import allow_all, deny_all
from jsonresolver import JSONResolver
from jsonresolver.contrib.jsonref import json_loader_factory

from cap.modules.oauthclient.contrib.cern import disconnect_handler
from cap.modules.oauthclient.rest_handlers import (authorized_signup_handler,
                                                   signup_handler)


def _(x):
    """Identity function used to trigger string extraction."""
    return x


# ************************************ #
# GOOD TO KNOW!
#
# Enviromental variables with INVENIO_ prefix
# will override variables set in the config.py
# ex.
#  ZENODO_ACCESS_TOKEN = 'CHANGE_ME'
#  will be overriden if INVENIO_ZENODO_ACCESS_TOKEN
#  is set in the ENVIRONMENT running the app
#
# ************************************ #

# Datadir
# =======
DATADIR = join(dirname(__file__), 'data')

# Path to app root dir
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

# Debug
# =====
# Flask-DebugToolbar is by default enabled when the application is running in
# debug mode. More configuration options are available at
# https://flask-debugtoolbar.readthedocs.io/en/latest/#configuration
#: Switches off incept of redirects by Flask-DebugToolbar.
DEBUG_TB_INTERCEPT_REDIRECTS = False

DEBUG_MODE = str(os.environ.get('DEBUG_MODE')).lower() == 'true'

if DEBUG_MODE:
    DEBUG = True
else:
    DEBUG = False

if DEBUG:
    REST_ENABLE_CORS = True
    APP_ENABLE_SECURE_HEADERS = False


# Cache
# =========
#: Redis Cache Host
CACHE_REDIS_HOST = os.environ.get("CACHE_REDIS_HOST", "localhost")
#: Redis Cache Port
CACHE_REDIS_PORT = os.environ.get("CACHE_REDIS_PORT", 6379)
#: Redis Cache base url
CACHE_REDIS_BASE_URL = "redis://{0}:{1}".format(
    CACHE_REDIS_HOST, CACHE_REDIS_PORT)
#: URL of Redis db.
CACHE_REDIS_URL = "{0}/0".format(CACHE_REDIS_BASE_URL)


# Rate limiting
# =============
#: Storage for ratelimiter.
RATELIMIT_STORAGE_URL = "{0}/3".format(CACHE_REDIS_BASE_URL)

# I18N
# ====
#: Default language
BABEL_DEFAULT_LANGUAGE = 'en'
#: Default time zone
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
#: Other supported languages (do not include the default language in list).
I18N_LANGUAGES = [('fr', _('French'))]

# Email configuration
# ===================
#: Email address for support.
SUPPORT_EMAIL = "analysis-preservation-support@cern.ch"
#: Disable email sending by default.
MAIL_DEBUG = False
MAIL_SUPPRESS_SEND = True

# Flask Security
# ========
#: Allow user to confirm their email address.
SECURITY_CONFIRMABLE = False
"""Allow users to login without first confirming their email address."""
SECURITY_LOGIN_WITHOUT_CONFIRMATION = True
"""Disable sending registration email."""
SECURITY_SEND_REGISTER_EMAIL = False
#: Email address used as sender of account registration emails.
SECURITY_EMAIL_SENDER = SUPPORT_EMAIL
#: Email subject for account registration emails.
SECURITY_EMAIL_SUBJECT_REGISTER = _(
    "Welcome to CERN Analysis Preservation!")

# Celery configuration
# ====================
BROKER_URL = 'amqp://guest:guest@localhost:5672/'
#: URL of message broker for Celery (default is RabbitMQ).
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672/'
#: URL of backend for result storage (default is Redis).
CELERY_RESULT_BACKEND = '{0}/2'.format(CACHE_REDIS_BASE_URL)
#: Scheduled tasks configuration (aka cronjobs).
CELERY_BEAT_SCHEDULE = {
    'indexer': {
        'task': 'invenio_indexer.tasks.process_bulk_queue',
        'schedule': timedelta(minutes=5),
    },
    'accounts': {
        'task': 'invenio_accounts.tasks.clean_session_table',
        'schedule': timedelta(minutes=60),
    },
    'cadi_sync': {
        'task': 'cap.modules.experiments.tasks.cms.synchronize_with_cadi',
        'schedule': timedelta(days=1),
    },
    'ping_webhooks': {
        'task': 'cap.modules.repoimporter.tasks.ping_webhooks',
        'schedule': timedelta(hours=12),
    },
    'das_harvester': {
        'task': 'cap.modules.experiments.tasks.cms.harvest_das',
        'schedule': timedelta(days=1),
    },
}
#: Accepted content types, used for serializing objects
#: when sending tasks to Celery (json default in 4.0)
# CELERY_ACCEPT_CONTENT = ['pickle', 'json']

# Database
# ========
#: Database URI including user and password
POSTGRESQL_CONFIGS = (
    os.environ.get("POSTGRESQL_USER"),
    os.environ.get("POSTGRESQL_PASSWORD"),
    os.environ.get("POSTGRESQL_HOST"),
    os.environ.get("POSTGRESQL_PORT"),
    os.environ.get("POSTGRESQL_DATABASE"),
)
if all(POSTGRESQL_CONFIGS):
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{}:{}@{}:{}/{}'.format(
        *POSTGRESQL_CONFIGS
    )
else:
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://cap:cap@localhost/cap'

# JSONSchemas
# ===========
#: Hostname used in URLs for local JSONSchemas.
JSONSCHEMAS_HOST = 'analysispreservation.cern.ch'

SCHEMAS_DEPOSIT_PREFIX = 'deposits/records/'
SCHEMAS_RECORD_PREFIX = 'records/'
SCHEMAS_OPTIONS_PREFIX = 'options/'

# Flask configuration
# ===================
# See details on
# http://flask.pocoo.org/docs/0.12/config/#builtin-configuration-values

#: Secret key - each installation (dev, production, ...) needs a separate key.
#: It should be changed before deploying.
SECRET_KEY = "changeme"
#: Max upload size for form data via application/mulitpart-formdata.
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MiB
#: Sets cookie with the secure flag by default
SESSION_COOKIE_SECURE = False
#: Since HAProxy and Nginx route all requests no matter the host header
#: provided, the allowed hosts variable is set to localhost. In production it
#: should be set to the correct host and it is strongly recommended to only
#: route correct hosts to the application.
APP_ALLOWED_HOSTS = [
    'localhost',
    'analysispreservation.web.cern.ch',
    'analysispreservation.cern.ch',
    'analysispreservation-dev.web.cern.ch',
    'analysispreservation-dev.cern.ch',
    'analysispreservation-qa.web.cern.ch',
    'analysispreservation-qa.cern.ch'
]

if os.environ.get('DEV_HOST', False):
    APP_ALLOWED_HOSTS.append(os.environ.get('DEV_HOST'))

# OAI-PMH
# =======
OAISERVER_ID_PREFIX = 'oai:analysispreservation.cern.ch:'

# Accounts
# ========
#: Redis session storage URL.
ACCOUNTS_SESSION_REDIS_URL = '{0}/1'.format(CACHE_REDIS_BASE_URL)

#: E-Groups for superuser rights
SUPERUSER_EGROUPS = [
    RoleNeed('analysis-preservation-support@cern.ch'),
    RoleNeed('data-preservation-admins@cern.ch'),
]

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
SEARCH_UI_SEARCH_API = '/api/deposits'

ELASTICSEARCH_USER = os.environ.get('ELASTICSEARCH_USER')
ELASTICSEARCH_PASSWORD = os.environ.get('ELASTICSEARCH_PASSWORD')

if ELASTICSEARCH_USER and ELASTICSEARCH_PASSWORD:
    es_params = dict(
        http_auth=(ELASTICSEARCH_USER, ELASTICSEARCH_PASSWORD),
        use_ssl=str(os.environ.get('ELASTICSEARCH_USE_SSL')).lower() == 'true',
        verify_certs=str(
            os.environ.get('ELASTICSEARCH_VERIFY_CERTS')).lower() == 'true',
        url_prefix=os.environ.get('ELASTICSEARCH_URL_PREFIX', ''),
    )
else:
    es_params = {}

SEARCH_ELASTIC_HOSTS = [
    dict(
        host=os.environ.get('ELASTICSEARCH_HOST', 'localhost'),
        port=int(os.environ.get('ELASTICSEARCH_PORT', '9200')),
        **es_params
    )
]

SEARCH_GET_MAPPINGS_IMP = 'cap.modules.schemas.imp.get_mappings'

# Admin
# ========
ADMIN_PERMISSION_FACTORY =  \
    'cap.modules.access.permissions.admin_permission_factory'

# Logging
# =======
#: CERN OAuth configuration
CERN_APP_CREDENTIALS = {
    'consumer_key': os.environ.get('INVENIO_CERN_APP_CREDENTIALS_KEY'),
    'consumer_secret': os.environ.get('INVENIO_CERN_APP_CREDENTIALS_SECRET')
}

# Update CERN OAuth handlers - due to REST - mostly only redirect urls
# and error flashing
CERN_REMOTE_APP.update(
    dict(
        authorized_handler=authorized_signup_handler,
        disconnect_handler=disconnect_handler,
    ))

CERN_REMOTE_APP['signup_handler']['view'] = signup_handler

#: Defintion of OAuth client applications.
OAUTHCLIENT_REMOTE_APPS = dict(cern=CERN_REMOTE_APP, )

# JSON Schemas
# ============
#: Path to where JSON metadata exist
JSON_METADATA_PATH = "/_metadata"
JSONSCHEMAS_ENDPOINT = '/schemas'

JSONSCHEMAS_RESOLVE_SCHEMA = True

JSONSCHEMAS_LOADER_CLS = json_loader_factory(
    JSONResolver(plugins=[
        'cap.modules.schemas.resolvers', 'cap.modules.schemas.resolvers_api'
    ], ))

# LHCb
# ========
#: Ana's database
# TOFIX: Check below PR for more info
# https://github.com/cernanalysispreservation/
# analysispreservation.cern.ch/pull/663
LHCB_ANA_DB = 'http://datadependency.cern.ch'
LHCB_GETCOLLISIONDATA_URL = '{0}/getRecoStripSoft?propass='.format(LHCB_ANA_DB)
LHCB_GETPLATFORM_URL = '{0}/getPlatform?app='.format(LHCB_ANA_DB)

# CMS
# ========
#: Kerberos credentials
CMS_USER_PRINCIPAL = os.environ.get("CMS_USER_PRINCIPAL")
CMS_USER_KEYTAB = os.environ.get("CMS_USER_KEYTAB")

CMS_ADMIN_EGROUP = 'cms-cap-admin@cern.ch'
CMS_COORDINATORS_EGROUP = 'cms-physics-coordinator@cern.ch'
CMS_CONVENERS_EGROUP = 'cms-phys-conveners-{wg}@cern.ch'

#: CADI database
CADI_AUTH_URL = 'https://icms.cern.ch/tools/api/cadiLine/BPH-13-009'
CADI_GET_CHANGES_URL = 'https://icms.cern.ch/tools/api/updatedCadiLines/'
CADI_GET_ALL_URL = 'https://icms.cern.ch/tools/api/viewCadiLines'
CADI_GET_RECORD_URL = 'https://icms.cern.ch/tools/api/cadiLine/{id}'

# ATLAS
# ========
#: Glance database
GLANCE_CLIENT_ID = 'CHANGE_ME'
GLANCE_CLIENT_PASSWORD = 'CHANGE_ME'
#: Glance API URLs
GLANCE_GET_TOKEN_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/oauth/token'
GLANCE_GET_ALL_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/atlas/analysis/analysis/?client_name=cap'  # noqa
GLANCE_GET_BY_ID_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/atlas/analysis/analysis/?client_name=cap&id={id}'  # noqa

# Files
# ===========
FILES_REST_PERMISSION_FACTORY = \
    'cap.modules.deposit.permissions:files_permission_factory'

# Grab files max size
FILES_URL_MAX_SIZE = (2**20) * 5000

# Header for updating file tags
FILES_REST_FILE_TAGS_HEADER = 'X-CAP-File-Tags'

# Indexer
# =======
#: Flag for not replacing refs when creating deposit
INDEXER_REPLACE_REFS = False

# LHCB DB files location
# ======================
LHCB_DB_FILES_LOCATION = os.path.join(
    APP_ROOT,
    'modules/experiments/static/example_lhcb/'
)

EXPERIMENTS_RESOURCES_LOCATION = os.path.join(
    APP_ROOT,
    'modules/experiments/static'
)

# Disable JWT token
ACCOUNTS_JWT_ENABLE = False

# Github and Gitlab oauth tokens
# ==============================
GITHUB_OAUTH_ACCESS_TOKEN = "CHANGE_ME"
GITLAB_OAUTH_ACCESS_TOKEN = "CHANGE_ME"

# Reana server url
# ================
REANA_ACCESS_TOKEN = {
    'ATLAS': os.environ.get('REANA_ATLAS_ACCESS_TOKEN'),
    'ALICE': os.environ.get('REANA_ALICE_ACCESS_TOKEN'),
    'CMS': os.environ.get('REANA_CMS_ACCESS_TOKEN'),
    'LHCb': os.environ.get('REANA_LHCb_ACCESS_TOKEN'),
}

# Keytabs
KEYTABS_LOCATION = '/etc/keytabs'

KRB_PRINCIPALS = {'CADI': (CMS_USER_PRINCIPAL, CMS_USER_KEYTAB)}

CERN_CERTS_PEM = None

# Zenodo
# ======
ZENODO_SERVER_URL = 'https://zenodo.org/api'

ZENODO_ACCESS_TOKEN = 'CHANGE_ME'

# Endpoints
# =========
DEPOSIT_UI_ENDPOINT = '{scheme}://{host}/drafts/{pid_value}'
RECORDS_UI_ENDPOINT = '{scheme}://{host}/published/{pid_value}'

# Webhooks & ngrok init
# =====================
# In order to debug webhooks, we need a tunnel to our local instance
# so we make sure that we have an ngrok tunnel running, and add it
# to the allowed hosts (to enable requests)
TEST_WITH_NGROK = os.environ.get('CAP_TEST_WITH_NGROK', False)
if DEBUG_MODE == 'True' and TEST_WITH_NGROK == 'True':
    try:
        resp = requests.get('http://localhost:4040/api/tunnels',
                            headers={'Content-Type': 'application/json'})
        NGROK_HOST = resp.json()['tunnels'][0]['public_url']
        APP_ALLOWED_HOSTS.append(NGROK_HOST.split('//')[-1])
        WEBHOOK_NGROK_URL = '{}/repos/event'.format(NGROK_HOST)
        print('* Webhook url at {}'.format(WEBHOOK_NGROK_URL))
    except (IndexError, KeyError):
        print('Ngrok is not running.')

WEBHOOK_ENDPOINT = 'cap_repos.get_webhook_event'
