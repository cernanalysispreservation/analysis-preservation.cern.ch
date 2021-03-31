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

import cap.modules.mail.custom.recipients as custom_recipients
import cap.modules.mail.custom.messages as custom_messages
import cap.modules.mail.custom.subjects as custom_subjects

from cap.modules.mail.conditions import CONDITION_METHODS


def get_recipients_from_config(record, config):
    """
    Retrieve the recipients that are provided in the schema config file.
    The different options are as follows:
    - default: a list of default recipients
    - owner/current_user/experiment, etc: user-related options,
      to be retrieved by the db
    - conditions: a dict that defines a path, and what should be true for
      that path, according to the record data, e.g.
      {"path": "foo.bar.options",
       "if": ["exists", "is_not_in"],
       "values": [true, "No"],
       "op": "and",
       "mail": ["test@cern.ch"]}
    All the used condition methods (found in the 'if' field),
    are in the conditions.py file.
    """
    recipients = []

    if config.get('owner'):
        recipients.append(CONDITION_METHODS['owner'](record))

    if config.get('current_user'):
        recipients.append(CONDITION_METHODS['current_user'](record))

    # TODO: update for experiment, roles (read/admin)

    # apply rules for conditions
    conditions = config.get('conditions', [])
    for cond in conditions:
        # the conditions of each list must all be True, in order to be accepted
        # we enumerate and check method/value in pairs
        condition_results = []
        path = cond['path']

        for i, method in enumerate(cond['if']):
            condition_results.append(
                CONDITION_METHODS[method](record, path, cond['values'][i])
            )

        # we check the validity of the condition depending on the operator:
        # - if 'and', then we need everything to be true
        # - if 'or' we need at least 1 true
        op = cond['op']
        if (op == 'and' and False not in condition_results) or \
                (op == 'or' and True in condition_results):
            recipients += cond['mails']

    # remove duplicates
    return list(set(recipients))


def generate_recipients(record, config):
    """
    Recipients generator for notification action.
    Retrieves from config and from custom function if it exists
    - custom function name in the 'func' field of the recipients config
    - implementation should ALWAYS go in the mail.custom.recipients.py file
    """
    re_config = config.get('recipients')
    if not re_config:
        return

    default = re_config.get('default', [])
    func = re_config.get('func')
    recipients = get_recipients_from_config(record, re_config)

    if default:
        recipients += default

    if func:
        custom_recipients_func = getattr(custom_recipients, func)
        recipients += custom_recipients_func(record, re_config)

    return recipients


def generate_message(record, host_url, config):
    """
    Message generator for notification action.
    Retrieves from config and from custom function if it exists
    - custom function name in the 'func' field of the message config
    - implementation should ALWAYS go in the mail.custom.messages.py file
    """
    msg_config = config.get('message')
    if not msg_config:
        return

    default = msg_config.get('default')
    func = msg_config.get('func')

    if default:
        return default

    if func:
        custom_message_func = getattr(custom_messages, func)
        message = custom_message_func(record, host_url, config)
        return message


def generate_subject(record, config):
    """
    Message generator for notification action.
    Retrieves from config and from custom function if it exists
    - custom function name in the 'func' field of the subject config
    - implementation should ALWAYS go in the mail.custom.subjects.py file
    """
    subj_config = config.get('subject')
    if not subj_config:
        return

    default = subj_config.get('default')
    func = subj_config.get('func')

    if default:
        return default

    if func:
        custom_subject_func = getattr(custom_subjects, func)
        subject = custom_subject_func(record, config)
        return subject
