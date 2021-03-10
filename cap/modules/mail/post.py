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

from .tasks import create_and_send
from .utils import generate_recipients, generate_message


def post_action_notifications(action=None, deposit=None, host_url=None):
    """
    Notification through mail, after specified deposit actions.
    The procedure followed to get the recipients will be described here:

    - according to the action name, we retrieve the schema config, and try to
      get the recipients
    - first we retrieve the config-related recipients, and then through custom
      functions, any additional ones
    - similar procedure for the messages
    - send mails, according to the different actions
    - if published/draft, important distinction
    """
    action_config = deposit.schema.config.get('notifications', {}) \
        .get('actions', {}) \
        .get(action)

    if not action_config:
        return

    recipients = generate_recipients(deposit, action_config)
    message = generate_message(deposit, action_config)

    if recipients:
        subject = action_config.get("email_subject")

        if action == "publish":
            recid, record = deposit.fetch_published()
            record_pid = recid.pid_value

            send_mail_on_publish(recipients, record_pid, host_url,
                                 record.revision_id, message,
                                 subject_prefix=subject)

        if action == "review":
            analysis_url = f'drafts/{deposit["_deposit"]["id"]}' \
                if deposit['_deposit']['status'] == 'draft' \
                else f'published/{deposit["control_number"]}'

            send_mail_on_review(recipients, analysis_url,
                                host_url, message,
                                subject_prefix=subject)


def send_mail_on_publish(recipients, recid, url, revision,
                         message, subject_prefix=''):
    """Mail procedure on analysis publication. Differentiates revisions."""
    if revision > 0:
        subject = f"{subject_prefix} - New Version of Published Analysis"
        template = "mail/analysis_published_revision.html"
    else:
        subject = f"{subject_prefix} - New Published Analysis"
        template = "mail/analysis_published_new.html"

    subject = f'{subject} | CERN Analysis Preservation'
    create_and_send.delay(
        template,
        dict(recid=recid,
             url=url,
             message=message),
        subject,
        recipients)


def send_mail_on_review(recipients, analysis_url, url,
                        message, subject_prefix=''):
    """Mail procedure on analysis review."""
    subject = f"{subject_prefix} - New Review on Analysis " \
              f"| CERN Analysis Preservation"
    template = "mail/analysis_review.html"

    create_and_send.delay(
        template,
        dict(analysis_url=analysis_url,
             url=url,
             message=message),
        subject,
        recipients)
