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

from flask import current_app
from flask_login import current_user

from invenio_accounts.models import User


def get_current_user(record, config=None):
    return current_user.email


def get_owner(record, config=None):
    owner = record['_deposit']['owners'][0]
    return User.query.filter_by(id=owner).one().email


def get_cms_stat_recipients(record, config=None):
    """Adds PAGS committee data from JSON file."""
    committee_pags = current_app.config.get("CMS_STATS_COMMITEE_AND_PAGS")
    working_group = record.get('analysis_context', {}).get('wg')

    if working_group and committee_pags:
        return committee_pags.get(working_group, {}).get("contacts", [])
    return []
