# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.
"""CAP config."""

import os

from setuptools import find_packages, setup

readme = open('README.rst').read()

DATABASE = "postgresql"
ELASTICSEARCH = "elasticsearch5"
INVENIO_VERSION = '3.0.0'  # "3.0.0rc2"

tests_require = [
    'check-manifest>=0.35',
    'coverage>=5.2.1',
    'isort>=4.3',
    'mock>=2.0.0',
    'pydocstyle>=2.0.0',
    'pytest-cov>=2.5.1',
    'pytest-invenio>=1.0.5,<=1.3.4',
    'pytest-mock>=1.6.0',
    'pytest-pep8>=1.0.6',
    'pytest-random-order>=0.5.4',
    'pytest==5.3.5',
    'yapf>=0.28.0',
    'responses==0.10.6',
    'selenium>=3.4.3',
]

extras_require = {'docs': ['Sphinx>=1.5.1'], 'tests': tests_require}

extras_require['all'] = []
for reqs in extras_require.values():
    extras_require['all'].extend(reqs)

extras_require['ldap'] = ['python-ldap>=2.4.39']

# Do not include in all requirement
extras_require['xrootd'] = [
    # 'invenio-xrootd>=1.0.0a6',
    # 'xrootdpyfs>=0.1.5',
]

setup_requires = ['Babel>=2.4.0', 'pytest-runner>=3.0.0,<5']

install_requires = [
    'Flask==0.12.4',
    'Flask-Cli>=0.4.0',
    'Flask-Cache>=0.13.1',
    'Flask-Debugtoolbar>=0.10.1',

    # CAP specific libraries
    'PyGithub>=1.35',
    'python-gitlab>=1.0.2',
    'python-cern-sso-krb==1.3.3',
    'python-gssapi==0.6.4',
    # FIX cryptography <=3.3.2 is needed for installation not to crash
    # https://github.com/Azure/azure-cli/issues/16858
    'cryptography<=3.3.2',
    'paramiko==2.7.1',
    'cachetools==3.1.0',

    # Pinned libraries
    'urllib3[secure]==1.22',
    'sqlalchemy==1.3.0',
    # temporary pinned since there are 'fs' conslicts between
    # 'reana-commons' and 'invenio-files-rest'
    'fs==0.5.4',
    'invenio-accounts-rest>=1.0.0a4',
    'invenio-oauthclient>=1.0.0',
    'invenio-userprofiles>=1.0.0',
    'invenio-query-parser>=0.3.0',
    'invenio[{db},{es},base,auth,metadata]~={version}'.format(
        db=DATABASE, es=ELASTICSEARCH, version=INVENIO_VERSION),
    'invenio-rest==1.0.0',
    'invenio-files-rest==1.0.0',
    'invenio-records-files==1.0.0a11',
    'coolname==1.1.0',
    'Authlib==0.15.1',
    # 'invenio-logging' < v1.2.0 is needed because of 'invenio-base' version
    # conflicts, USING 'cernanalysispreservation/invenio-logging' FORM now
    # 'invenio-logging[sentry, sentry-sdk]<=1.2.0',
    'uWSGI==2.0.17',
    'uwsgi-tools==1.1.1',
    'uwsgitop==0.10',
    # needed version for future use of arguments
    'webargs==3.0.1',
    'pyOpenSSL==19.1.0'
]

packages = find_packages()

# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join('cap', 'version.py'), 'rt') as fp:
    exec (fp.read(), g)
    version = g['__version__']

setup(
    name='cap',
    version=version,
    description=__doc__,
    long_description=readme,
    keywords='cap cern analysis preservation',
    license='MIT',
    author='CERN',
    author_email='analysis-preservation-support@cern.ch',
    url=
    'https://github.com/cernanalysispreservation/analysispreservation.cern.ch',  # noqa
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    entry_points={
        'console_scripts': ['cap = cap.cli:cli'],
        'invenio_access.actions': [
            'cms_access = '
            'cap.modules.experiments.permissions:cms_access_action',
            'cms_pag_convener_access = '
            'cap.modules.experiments.permissions:cms_pag_convener_action_all',
            'lhcb_access = '
            'cap.modules.experiments.permissions:lhcb_access_action',
            'alice_access = '
            'cap.modules.experiments.permissions:alice_access_action',
            'atlas_access = '
            'cap.modules.experiments.permissions:atlas_access_action',
            # deposit actions
            'deposit_schema_read = '
            'cap.modules.schemas.permissions:deposit_schema_read_action_all',
            'deposit_schema_update = '
            'cap.modules.schemas.permissions:deposit_schema_update_action_all',
            'deposit_schema_admin = '
            'cap.modules.schemas.permissions:deposit_schema_admin_action_all',
            'deposit_schema_clone = '
            'cap.modules.schemas.permissions:deposit_schema_clone_action_all',
            'deposit_schema_review = '
            'cap.modules.schemas.permissions:deposit_schema_review_action_all',
            # record actions
            'record_schema_read = '
            'cap.modules.schemas.permissions:record_schema_read_action_all',
            'record_schema_update = '
            'cap.modules.schemas.permissions:record_schema_update_action_all',
            'record_schema_admin = '
            'cap.modules.schemas.permissions:record_schema_admin_action_all',
            'record_schema_delete = '
            'cap.modules.schemas.permissions:record_schema_delete_action_all',
            # schema actions
            'schema_object_read = '
            'cap.modules.schemas.permissions:schema_read_action_all',
            'schema_object_admin = '
            'cap.modules.schemas.permissions:schema_admin_action_all',
        ],
        'invenio_base.api_apps': [
            'cap_access = cap.modules.access.ext:CAPAccess',
            'cap_cache = cap.modules.cache.ext:CAPCache',
            'cap_deposit = cap.modules.deposit.ext:CAPDeposit',
            'cap_experiments = cap.modules.experiments.ext:CAPExperiments',
            'cap_fixtures = cap.modules.fixtures.ext:CAPFixtures',
            'cap_xrootd = cap.modules.xrootd.ext:CapXRootD',
            'cap_auth = cap.modules.auth.ext:CAPOAuth',
            'cap_mail = cap.modules.mail.ext:CAPMail',
        ],
        'invenio_base.api_blueprints': [
            'cap = cap.views:blueprint',
            'cap_user = cap.modules.user.views:user_blueprint',
            'cap_oauth2server_settings = '
            ' cap.modules.oauth2server.views.settings:blueprint',
            'cap_oauth2server_server = '
            ' cap.modules.oauth2server.views.server:blueprint',
            'cap_atlas = cap.modules.experiments.views.atlas:atlas_bp',
            'cap_lhcb = cap.modules.experiments.views.lhcb:lhcb_bp',
            'cap_cms = cap.modules.experiments.views.cms:cms_bp',
            'cap_workflows = cap.modules.workflows.views:workflows_bp',
            'cap_services = cap.modules.services.views:blueprint',
            'cap_schemas = cap.modules.schemas.views:blueprint',
            'cap_auth = cap.modules.auth.views:blueprint',
            'cap_repos = cap.modules.repos.views:repos_bp',
            'invenio_oauthclient = invenio_oauthclient.views.client:blueprint',
        ],
        'invenio_celery.tasks': [
            # 'cap_deposit = cap.modules.deposit.loaders',
            'cap_cms = cap.modules.experiments.tasks.cms',
            'cap_lhcb = cap.modules.experiments.tasks.lhcb',
        ],
        'invenio_search.mappings': [],
        'invenio_pidstore.minters': [
            'cap_record_minter = '
            'cap.modules.records.minters:cap_record_minter',
            'cap_deposit_minter = '
            'cap.modules.deposit.minters:cap_deposit_minter',
        ],
        'invenio_pidstore.fetchers': [
            'cap_record_fetcher = '
            'cap.modules.records.fetchers:cap_record_fetcher',
            'cap_deposit_fetcher = '
            'cap.modules.deposit.fetchers:cap_deposit_fetcher',
        ],
        'invenio_records.jsonresolver': [
            'schemas = cap.modules.schemas.resolvers',
        ],
        'invenio_db.models': [
            'cap_reana_model = cap.modules.workflows.models',
            'analysis_schema_model = cap.modules.schemas.models',
            'status_check_model = cap.modules.services.models',
            'auth = cap.modules.auth.models',
            'repos_model = cap.modules.repos.models',
        ],
        'invenio_db.alembic': ['cap = cap:alembic'],
        'invenio_config.module': ['cap = cap.config']
    },
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Development Status :: 3 - Alpha',
    ],
)
