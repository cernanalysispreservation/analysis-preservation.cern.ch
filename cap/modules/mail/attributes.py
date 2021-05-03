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

from .custom import recipients as custom_recipients
from .custom import messages as custom_messages
from .custom import subjects as custom_subjects
from .custom import templates as custom_templates

from .conditions import CONDITION_METHODS
from .utils import CONFIG_DEFAULTS, populate_template_from_ctx,\
    update_mail_list


def check_condition(record, condition):
    # for each condition we have a group of checks to perform
    # all of the checks should give a True/False result
    operator = condition.get('op', 'and')
    checks = condition['checks']
    check_results = []

    for check in checks:
        # get the method to apply, and use it on the required path/value
        if check.get('if'):
            method = CONDITION_METHODS[check['if']]
            check_results.append(
                method(record, check.get('path'), check['value'])
            )
        else:
            check_results.append(
                check_condition(record, check)
            )

    # we check the validity of the condition depending on the operator:
    # - if 'and', then we need everything to be true
    # - if 'or' we need at least 1 true
    if (operator == 'and' and False not in check_results) or \
            (operator == 'or' and True in check_results):
        return True
    return False


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
    if not config:
        return []

    mails = []

    for item in config:
        _type = item['type']

        if _type == 'default':
            mail_config = item.get('mails', {})
            update_mail_list(record, mail_config, mails)

        if _type == 'method':
            method = getattr(custom_recipients, item['method'])
            result = method(record, item)
            mails += result if isinstance(result, list) else [result]
            pass

        if _type == 'condition':
            if check_condition(record, item):
                mail_config = item.get('mails', {})
                update_mail_list(record, mail_config, mails)

    # remove duplicates and possible empty values
    return [mail for mail in set(mails) if mail]


def generate_recipients(record, config):
    """
    Recipients generator for notification action.
    Retrieves from config and from custom function if it exists:
    - custom function name in the 'func' field of the recipients config
    - implementation should ALWAYS go in the mail.custom.recipients.py file

    Also returns the `type` of the recipients that the mail should have, in
    this case: recipients/bcc/cc.
    """
    re_config = config.get('recipients')
    if not re_config:
        return

    recipients = get_recipients_from_config(record, re_config.get('recipients'))  # noqa
    cc = get_recipients_from_config(record, re_config.get('cc'))
    bcc = get_recipients_from_config(record, re_config.get('bcc'))

    return recipients, cc, bcc


def generate_message(record, config, action):
    """
    Message generator for notification action.
    Retrieves from config and from custom function if it exists:
    - custom function name in the 'func' field of the message config
    - implementation should ALWAYS go in the mail.custom.messages.py file
    - if a template and context are available, it will be rendered and added
      to the mail
    - the default is None, where the mail sent will just show standard info
      (analysis published, etc)

    Example of message config:
    "message": {
      "template": "mail/message/message_review.html",
      "ctx": {
        "title": {
          "type": "path",
          "path": "general_title"
        }
      }
    }
    """
    msg_config = config.get('message')
    if not msg_config:
        return

    default = msg_config.get('default')
    if default:
        return default

    func = msg_config.get('method')
    if func:
        custom_message_func = getattr(custom_messages, func)
        message = custom_message_func(record, config)
        return message

    return populate_template_from_ctx(
        record, msg_config, action,
        module=custom_messages,
        type='message'
    )


def generate_subject(record, config, action):
    """
    Message generator for notification action.
    Retrieves from config and from custom function if it exists
    - custom function name in the 'func' field of the subject config
    - implementation should ALWAYS go in the mail.custom.subjects.py file
    - the default, according to the `action`, is retrieved from the
      `SUBJECT_DEFAULTS` in the `cap.mail.utils.py` file
    Example of subject config:
    "subject": {
      "template": "mail/subject/subject_published.html",
      "ctx": {
        "cadi_id": {
          "type": "path",
          "path": "analysis_context.cadi_id"
        }
      }
    }
    """
    subj_config = config.get('subject')
    if not subj_config:
        return CONFIG_DEFAULTS[action]['subject']

    default = subj_config.get('default')
    if default:
        return default

    func = subj_config.get('method')
    if func:
        custom_subject_func = getattr(custom_subjects, func)
        subject = custom_subject_func(record, config)
        return subject

    return populate_template_from_ctx(
        record, subj_config, action,
        module=custom_subjects,
        type='subject'
    )


def generate_template(record, config, action):
    """
    Template generator for notification action.
    Retrieves from config and from custom function if it exists:
    - custom function name in the 'func' field of the template config
    - implementation should ALWAYS go in the mail.custom.templates.py file
    - the default, according to the `action`, is retrieved from the
      `TEMPLATE_DEFAULTS` in the `cap.mail.utils.py` file
    """
    template_config = config.get('template')
    if not template_config:
        return CONFIG_DEFAULTS[action]['template']

    # plain or html
    plain = template_config.get('plain')

    default = template_config.get('default')
    if default:
        template = default

    func = template_config.get('method')
    if func:
        custom_template_func = getattr(custom_templates, func)
        template = custom_template_func(record, config)

    return template, plain
