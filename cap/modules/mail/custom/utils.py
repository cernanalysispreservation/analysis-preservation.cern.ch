# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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


def create_analysis_url(deposit):
    status = deposit['_deposit']['status']
    return f'drafts/{deposit["_deposit"]["id"]}' \
        if status == 'draft' \
        else f'published/{deposit["control_number"]}'


def create_base_message(deposit, host_url, params=None):
    cadi_id = deposit.get('analysis_context', {}).get('cadi_id')
    cadi_url = f'https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode={cadi_id}'\
        if cadi_id else 'None'

    cadi = f"CADI URL: {cadi_url}\n"
    title = f"Title: {deposit.get('general_title')}\n"
    quest = f"Questionnaire URL: {host_url}{create_analysis_url(deposit)}\n"

    msg = f"{title}{cadi}{quest}"

    if params:
        stats_assignee = f"Statistics Committee assignee: " \
                         f"{params.get('primary', '-')} (primary), " \
                         f"{params.get('secondary', '-')} (secondary)\n"
        msg += stats_assignee

    return msg


def create_base_subject(config, cadi_id=None):
    return f"Questionnaire for {cadi_id} - " \
        if cadi_id \
        else config.get("subject", {}).get('default')


def check_for_permission(email):
    return Permission(RoleNeed(email)).can()
