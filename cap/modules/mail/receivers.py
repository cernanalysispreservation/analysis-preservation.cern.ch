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
from flask import request

from .custom.utils import create_analysis_url
from .attributes import generate_recipients, generate_message, generate_subject
from .post import send_mail_on_publish, send_mail_on_review


def post_action_notifications(sender, action=None, pid=None, deposit=None):
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
        host_url = request.host_url
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
