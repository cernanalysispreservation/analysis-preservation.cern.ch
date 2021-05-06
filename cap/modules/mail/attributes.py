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
    """
    For each condition we have a group of checks to perform, which should
    return True/False

    Each condition has the following:
    - `checks`: the checks to be evaluated
    - `op`: the operation to be used for all the checks (and/or)
    - `mails`: the mail list

    Each check has their own attributes:
    - `if`: the type of check (e.g. exists, is_in, etc)
    - `value`: the result
    - `path`: the path that gets the field to be evaluated

    An example of conditions:
    {
      "type": "condition",
      "checks": [{
        "path": "parton_distribution_functions",
        "if": "exists",
        "value": true
      }],
      "mails": {
        "default": ["pdf-forum-placeholder@cern.ch"]
      }
    }

    Nested checks are also allowed.
    """
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
    The `recipients` field differentiates 3 categories:
    - recipients
    - cc
    - bcc
    All 3 can be used to send a mail, and have their own mails and rules about
    how they will be added.

    The rules are in 3 categories:
    - `default`: the mails in the list will be added
    - `method`: a method that returns a list of mail (for complicated options)
    - `conditions`: mails will be added if a certain condition is true

    An example config of recipients:
    "recipients": {
      "bcc": [
        {
          "type": "method",
          "method": "get_owner"
        }, {
          "type": "default",
          "mails": {
            "default": ["some-recipient-placeholder@cern.ch"],
            "formatted": [{
              "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",  # noqa
              "ctx": [{
                "name": "cadi_id",
                "type": "path",
                "path": "analysis_context.cadi_id"
              }]
            }]
          }
        }, {
          "type": "condition",
          ...
        }
      ]
    }
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
    Using the `get_recipients_from_config` function, it retrieves and returns
    3 possible lists of mails: recipients, bcc, cc.
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
    It requires a template and a context (dict of vars-values), to populate it.
    If no template is found, the default one will be used.

    Example of message config:
    "message": {
      "template_file": "mail/message/questionnaire_message_published.html",
      "ctx": [{
        "name": "title",
        "type": "path",
        "path": "general_title"
      }, {
        "type": "method",
        "method": "submitter_mail"
      }]
    }

    In case of `method`, then the message will be retrieved from the result of
    the method. It's implementation should always be in the mail.custom.messages.py file  # noqa
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
    Subject generator for notification action.
    It requires a template and a context (dict of vars-values), to populate it.
    If no template is found, the default one will be used.

    Example of subject config:
    "subject": {
      "template": "Subject with {{ title }} and id {{ published_id }}",
      "ctx": [{
        "name": "title",
        "type": "path",
        "path": "general_title"
      }, {
        "type": "method",
        "method": "published_id"
      }]
    }

    In case of `method`, then the subject will be retrieved from the result of
    the method. It's implementation should always be in the mail.custom.subjects.py file  # noqa
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
    Template generator for notification action. Differentiates between html or
    plain text using the `plain` variable.

    Example of subject config:
    "template": {
      "default": "mail/analysis_plain_text.html",
      "plain": true
    }

    In case of `method`, then the template will be retrieved from the result of
    the method. It's implementation should always be in the mail.custom.templates.py file  # noqa
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
