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

from ..users import get_record_owner, get_current_user


def get_review_message(record, config):
    """Message func for review."""
    message = f"Submitted by {get_record_owner(record)}, " \
              f"and reviewed by {get_current_user(record)}."
    return message


def get_cms_stat_message(record, config):
    """Message func for cms questionnaire."""
    committee_pags = current_app.config.get("CMS_STATS_COMMITTEE_AND_PAGS")

    working_group = record.get('analysis_context', {}).get('wg')
    reviewer_params = committee_pags.get(working_group, {}).get("params", {}) \
        if working_group and committee_pags \
        else {}

    message = ''
    cadi_id = record.get('analysis_context', {}).get('cadi_id')

    if cadi_id:
        message += f"A CMS Statistical Questionnaire has been published " \
                   f"for analysis with CADI ID {cadi_id}. "

    if reviewer_params:
        message += f"The primary (secondary) contact for reviewing your " \
                   f"questionnaire is {reviewer_params.get('primary')} " \
                   f"({reviewer_params.get('secondary')}). "

    message += f"Submitted by {get_current_user(record)}"
    return message
