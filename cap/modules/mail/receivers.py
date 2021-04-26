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

from .attributes import generate_recipients, generate_message,\
    generate_subject, generate_template
from .tasks import create_and_send
from .utils import create_analysis_url


def post_action_notifications(sender, action=None, pid=None, deposit=None):
    """
    Notification through mail, after specified deposit actions.
    The procedure followed to get the mail attrs will be described here:

    - Get the config for the action that triggered the receiver.
    - Through the configuration, retrieve the recipients, subject, template
      and message, and render them when needed.
    - Create the message and mail contexts (attributes), and pass them to
      the `create_and_send` task.
    """
    sender = current_app.config.get('MAIL_DEFAULT_SENDER')
    action_configs = deposit.schema.config.get('notifications', {}) \
        .get('actions', {}) \
        .get(action, [])

    for config in action_configs:
        recipients, cc, bcc = generate_recipients(deposit, config)
        subject = generate_subject(deposit, config, action)

        if not any([recipients, cc, bcc]):
            current_app.logger.error(
                f'Mail Error from {sender} with subject: {subject}.\n'
                f'Empty recipient list.')

        message = generate_message(deposit, config, action)
        template, plain = generate_template(deposit, config, action)

        mail_ctx = {
            'sender': sender,
            'subject': subject,
            'recipients': recipients,
            'cc': cc,
            'bcc': bcc
        }

        if action == "publish":
            recid, record = deposit.fetch_published()
            msg_ctx = dict(recid=recid.pid_value,
                           revision=record.revision_id,
                           url=request.host_url,
                           message=message)

        if action == "review":
            analysis_url = create_analysis_url(deposit)
            msg_ctx = dict(analysis_url=analysis_url,
                           url=request.host_url,
                           message=message)

        create_and_send.delay(
            template, msg_ctx, mail_ctx,
            plain=plain
        )
