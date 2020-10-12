# * coding: utf8 *
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
# MA 021111307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""CAP Schema cli."""

import itertools
import json
import os

import click
from flask import current_app
from flask_cli import with_appcontext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from invenio_accounts.models import Role
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_search import current_search_client

from cap.cli import MutuallyExclusiveOption
from cap.modules.deposit.errors import DepositValidationError
from cap.modules.fixtures.cli import fixtures
from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import resolve_schema_by_url,\
    resolve_schema_by_name_and_version, schema_name_to_url
from cap.modules.schemas.utils import process_action, actions_from_type


@fixtures.command()
@click.option('--permissions', '-p',
              required=True,
              help='Permission actions to be removed from roles.'
                   ' Accepts multiple options.')
@click.option('--roles', '-r',
              required=True,
              help='Role name(s) that access will be removed from.'
                   ' Accepts multiple options.')
# deposit / record / schema
@click.option('--deposit', '_type',
              flag_value='deposit',
              default=True)
@click.option('--record', '_type',
              flag_value='record')
@click.option('--schema', '_type',
              flag_value='schema')
# allow / remove / deny
@click.option('--allow', 'schema_action',
              flag_value='allow',
              default=True)
@click.option('--deny', 'schema_action',
              flag_value='deny')
@click.option('--remove', 'schema_action',
              flag_value='remove')
@click.argument('schema-name')
@with_appcontext
def permissions(schema_name, permissions, roles, _type, schema_action):
    """
    Schema permission command group. Allows/Denies/Removes certain actions
    to roles, in order to have access to a deposit/record/schema.
    Examples:
        cap fixtures permissions
            -p read,admin -r test-users@cern.ch --allow --deposit SCHEMA_NAME
            -p read -r test-users@cern.ch --deny --deposit SCHEMA_NAME
            -p read -r test-users@cern.ch --allow --record SCHEMA_NAME
            -p read,admin -r test-users@cern.ch --allow --schema SCHEMA_NAME
    """
    perms = permissions.split(',')
    roles = roles.split(',')

    # create the correct action names, and
    # check if action is subscribed and can be used
    requested_actions = actions_from_type(_type, perms)
    allowed_actions = current_app.extensions['invenio-access'].actions

    for action in requested_actions:
        if action not in allowed_actions.keys():
            raise click.BadParameter(f'Action {action} is not registered.')

    # check if roles exist
    for role in roles:
        try:
            Role.query.filter_by(name=role).one()
        except NoResultFound:
            raise click.BadParameter(f'Role with name {role} not found.')

    # create all combinations of actions and roles
    actions_roles = list(itertools.product(requested_actions, roles))
    process_action(schema_action, schema_name, actions_roles)


@fixtures.command()
@click.option('--schema-url', '-u',
              cls=MutuallyExclusiveOption,
              mutually_exclusive=["ana_type", "ana_version"],
              help='The url of the schema used for validation.')
@click.option('--ana-type', '-a',
              cls=MutuallyExclusiveOption,
              mutually_exclusive=["schema_url"],
              help='The analysis type of the schema used for validation.')
@click.option('--ana-version', '-v',
              help='The analysis version of the records.')
@click.option('--compare-with', '-c',
              help='The schema version, that the '
                   'records should be compared to.')
@click.option('--status', '-s',
              default='draft',
              type=click.Choice(['draft', 'published']),
              help='The metadata type that will be used for validation.')
@click.option('--export', '-e',
              type=click.Path(),
              help='A file where, the validation errors can be saved.')
@click.option('--export-type', '-et',
              default=None,
              type=click.Choice(['md']),
              help='The export type that will be used for output.')
@with_appcontext
def validate(schema_url, ana_type, ana_version, compare_with,
             status, export, export_type):
    """
    Validate deposit or record metadata based on their schema. Provide the
    schema url OR ana-type and version, as well as the schema version that you
    want to compare the records you get, to. E.g.

    If you do not provide an ana-version, it will get the latest. If you do
    not provide a -c parameter, the records will compare the data to their
    own schema.

    cap fixtures validate -u https://analysispreservation.cern.ch/schemas/deposits/records/test-v2.0.0.json -c 1.0.0  # noqa
    cap fixtures validate -a test -c 1.0.0
    """
    try:
        if schema_url:
            schema = resolve_schema_by_url(schema_url)
        elif ana_type:
            schema = resolve_schema_by_name_and_version(ana_type, ana_version)
        else:
            raise click.UsageError(
                'You need to provide the ana-type or the schema-url.')
    except JSONSchemaNotFound:
        raise click.UsageError(
            'Schema not found.')
    except ValueError:
        raise click.UsageError(
            'Version has to be passed as string <major>.<minor>.<patch>.')

    # differentiate between drafts/published
    from cap.modules.deposit.api import CAPDeposit
    from cap.modules.records.api import CAPRecord

    if status == 'draft':
        search_path = 'deposits-records'
        cap_record_class = CAPDeposit
    else:
        search_path = 'records'
        cap_record_class = CAPRecord

    # get all the records for this specific schema/type combination
    records = current_search_client.search(
        search_path,
        q=f'_deposit.status: {status} AND '
          f'$schema: "{schema_name_to_url(schema.name, schema.version)}"',
        size=5000
    )['hits']['hits']
    pids = [rec['_id'] for rec in records]

    click.secho(
        f'{len(records)} record(s) of {schema.name} found.\n', fg='green')

    total_errors = []
    for pid in pids:
        cap_record = cap_record_class.get_record(pid)
        cap_record_pid = cap_record.get('_deposit', {}).get('id')
        cap_record_cadi_id = cap_record.get('basic_info', {}).get('cadi_id')
        cap_host = 'https://analysispreservation.cern.ch/drafts'
        # get the url of the schema version, used for validation
        if compare_with:
            cap_record['$schema'] = schema_name_to_url(
                schema.name, compare_with)
        try:
            cap_record.validate()
            click.secho(f'No errors found in record {pid}', fg='green')
        except DepositValidationError as exc:
            if export_type == 'md':
                msg = '- [ ] Errors in **CADI ID:** ' + \
                    f'{cap_record_cadi_id or "?"}' + \
                    f' - **[link]({cap_host}/{cap_record_pid})** :\n'
                msg += "\n| Field Path | Error | \n| ---------- | ----- | \n"
                for err in exc.errors:
                    _err = err.res
                    msg += f"| ```{_err.get('field')}``` |"
                    msg += f" {_err.get('message')}  | \n"
                msg += "----\n"
            else:
                error_list = '\n'.join(str(err.res) for err in exc.errors)
                msg = f'Errors in {pid} - CADI ' + \
                      f'id: {cap_record_cadi_id or "?"}' + \
                      f' - {cap_host}/{cap_record_pid} :\n{error_list}'

            click.secho(msg, fg='red')

            if export:
                total_errors.append(msg)

    # export the errors in a file
    if export:
        with open(export, 'w') as out:
            out.writelines('\n\n'.join(err for err in total_errors))
        click.secho(f'Errors saved at {export}.', fg='red')


@fixtures.command()
@with_appcontext
@click.option('--dir',
              '-d',
              type=click.Path(exists=True),
              default='cap/modules/fixtures/schemas')
def schemas(dir):
    """Load default schemas."""
    for root, dirs, files in os.walk(dir):
        for file in files:
            if file.endswith(".json"):
                fullpath = os.path.join(root, file)
                with open(fullpath, 'r') as f:
                    try:
                        json_content = json.load(f)
                        add_schema_from_fixture(data=json_content)
                    except ValueError:
                        click.secho(
                            f"Not valid json in {fullpath} file", fg='red')
                        continue


def add_schema_from_fixture(data=None):
    """Add or update schema."""
    allow_all = data.pop("allow_all", False)
    name = data['name']

    try:
        with db.session.begin_nested():
            with db.session.begin_nested():
                try:
                    schema = Schema.get(name=data['name'],
                                        version=data['version'])
                    click.secho(f'{str(name)} already exist in the db.')
                    return

                except JSONSchemaNotFound:
                    schema = Schema(**data)
                    db.session.add(schema)

            if allow_all:
                schema.add_read_access_for_all_users()

    except IntegrityError:
        click.secho(
            f'Error occurred during adding {str(name)} to the db.\n', fg='red')
        return

    db.session.commit()
    click.secho(f'{str(name)} has been added.', fg='green')
