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

from .utils import create_base_message
from ..users import get_record_owner, get_current_user


def get_cms_stat_message(record, host_url, config=None):
    """Message func for cms questionnaire."""
    committee_pags = current_app.config.get("CMS_STATS_COMMITTEE_AND_PAGS")
    working_group = record.get('analysis_context', {}).get('wg')
    submitter_mail = get_current_user(record)

    reviewer_params = committee_pags.get(working_group, {}).get("params", {}) \
        if working_group and committee_pags \
        else {}

    message = create_base_message(record, host_url, reviewer_params)
    message += f"Submitted by {submitter_mail}."

    return message


def get_review_message(record, host_url, config=None):
    """Message func for review."""
    # owner and reviewer mail
    owner_mail = get_record_owner(record)
    reviewer_mail = get_current_user(record)

    message = create_base_message(record, host_url)
    message += f"Submitted by {owner_mail}, and reviewed by {reviewer_mail}."

    return message
