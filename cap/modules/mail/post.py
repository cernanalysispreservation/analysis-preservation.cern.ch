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

from .custom.utils import create_analysis_url
from .tasks import create_and_send
from .attributes import generate_recipients, generate_message, generate_subject


def post_action_notifications(action=None, deposit=None, host_url=None):
    """
    Notification through mail, after specified deposit actions.
    The procedure followed to get the recipients will be described here:

    - according to the action name, we retrieve the schema config, and try to
      get the recipients
    - first we retrieve the config-related recipients, and then through custom
      functions, any additional ones
    - similar procedure for the messages, subjects
    - send mails, according to the different actions
    """
    action_config = deposit.schema.config.get('notifications', {}) \
        .get('actions', {}) \
        .get(action)

    if not action_config:
        return

    recipients = generate_recipients(deposit, action_config)
    if recipients:
        message = generate_message(deposit, host_url, action_config)
        subject = generate_subject(deposit, action_config)

        if action == "publish":
            recid, record = deposit.fetch_published()
            send_mail_on_publish(recid.pid_value, host_url, record.revision_id,
                                 message, subject, recipients)

        if action == "review":
            analysis_url = create_analysis_url(deposit)
            send_mail_on_review(analysis_url, host_url,
                                message, subject, recipients)


def send_mail_on_publish(recid, url, revision,
                         message, subject, recipients):
    """Mail procedure on analysis publication. Differentiates revisions."""
    template = "mail/analysis_published_revision.html" \
        if revision > 0 \
        else "mail/analysis_published_new.html"
    send_mail_on_hypernews(message, subject, recipients)

    create_and_send.delay(
        template,
        dict(recid=recid,
             url=url,
             message=message),
        subject,
        recipients)


def send_mail_on_review(analysis_url, url,
                        message, subject, recipients):
    """Mail procedure on analysis review."""
    template = "mail/analysis_review.html"
    send_mail_on_hypernews(message, subject, recipients)

    create_and_send.delay(
        template,
        dict(analysis_url=analysis_url,
             url=url,
             message=message),
        subject,
        recipients)


def send_mail_on_hypernews(message, subject, recipients):
    # differentiate between hypernews mail and the others
    r = re.compile('hn-cms-.+')
    hypernews_list = [rec for rec in recipients if r.match(rec)]

    if hypernews_list:
        template = "mail/analysis_plain_text.html"
        recipients.remove(hypernews_list[0])

        create_and_send.delay(
            template,
            dict(message=message),
            subject,
            hypernews_list,
            type="plain"
        )
