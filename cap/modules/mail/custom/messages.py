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

from flask import current_app, request

from ..users import get_record_owner, get_current_user
from ..utils import create_analysis_url


def create_questionnaire_url(record, config):
    return f"{request.host_url}{create_analysis_url(record)}\n"


def get_submitter_mail(record, config):
    return get_current_user(record)


def get_reviewer_mail(record, config):
    return get_record_owner(record)


def get_reviewer_params(record, config):
    """Retrieve reviewer parameters according to the working group."""
    committee_pags = current_app.config.get("CMS_STATS_COMMITEE_AND_PAGS")
    working_group = record.get('analysis_context', {}).get('wg')

    if working_group and committee_pags:
        return committee_pags.get(working_group, {}).get("params", {})
    return {}
