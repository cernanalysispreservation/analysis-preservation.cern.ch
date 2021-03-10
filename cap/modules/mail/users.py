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

from flask_login import current_user

from invenio_access.models import ActionUsers
from invenio_accounts.models import User
from invenio_oauthclient.models import RemoteAccount
from invenio_pidstore.resolver import Resolver

resolver = Resolver(pid_type='depid',
                    object_type='rec',
                    getter=lambda x: x)

experiment_groups = {
    'cms': 'cms-members',
    'atlas': 'atlas-active-members-all',
    'alice': 'alice-member',
    'lhcb': 'lhcb-general'
}


def get_all_users():
    users = User.query.all()
    return [user.email for user in users]


def get_users_by_experiment(experiment):
    group = experiment_groups[experiment]
    all_accounts = RemoteAccount.query.all()

    users = [
        account.user
        for account in all_accounts
        if group in account.extra_data['groups']
    ]

    return [user.email for user in users]


def get_users_by_record(depid, role=None):
    _, uuid = resolver.resolve(depid)
    action_users = ActionUsers.query.filter_by(argument=str(uuid)).all() \
        if not role \
        else ActionUsers.query.filter_by(argument=str(uuid),
                                         action=f'deposit-{role}').all()

    return set(au.user.email for au in action_users)


# Mail specific actions
def get_current_user(record):
    return current_user.email


def get_record_owner(record):
    owner = record['_deposit']['owners'][0]
    return User.query.filter_by(id=owner).one().email
