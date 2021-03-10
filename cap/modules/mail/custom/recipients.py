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

import re
from flask import current_app
from flask_principal import RoleNeed
from invenio_access.permissions import Permission


def get_review_recipients(record, config):
    """Adds hypernews mail, if the cadi-id is well-formed."""
    hypernews_mail = current_app.config.get("CMS_HYPERNEWS_EMAIL_FORMAT")
    cadi_regex = current_app.config.get("CADI_REGEX")

    recipients = []
    cadi_id = record.get('analysis_context', {}).get('cadi_id')

    # if CADI ID mail Hypernews if review from admin reviewer (stat committee)
    if cadi_id:
        cms_stats_committee_email = current_app.config.get(
            "CMS_STATS_QUESTIONNAIRE_ADMIN_ROLES")

        # check that current user is a aon reviewer
        if cms_stats_committee_email and \
                Permission(RoleNeed(cms_stats_committee_email)).can():
            # mail for reviews - Hypernews
            # should be sent to hn-cms-<cadi-id>@cern.ch if
            # well-formed cadi id
            if re.match(cadi_regex, cadi_id) and hypernews_mail:
                recipients.append(hypernews_mail.format(cadi_id))

    return recipients


def get_cms_stat_recipients(record, config):
    """
    Adds hypernews mail, if the cadi-id is well-formed.
    Also adds PAGS committee data from JSON file.
    """
    hypernews_mail = current_app.config.get("CMS_HYPERNEWS_EMAIL_FORMAT")
    cadi_regex = current_app.config.get("CADI_REGEX")
    committee_pags = current_app.config.get("CMS_STATS_COMMITTEE_AND_PAGS")

    working_group = record.get('analysis_context', {}).get('wg')
    recipients = committee_pags.get(working_group, {}).get("contacts", []) \
        if working_group and committee_pags \
        else []

    cadi_id = record.get('analysis_context', {}).get('cadi_id')

    if cadi_id and re.match(cadi_regex, cadi_id):
        recipients.append(hypernews_mail.format(cadi_id))

    return recipients
