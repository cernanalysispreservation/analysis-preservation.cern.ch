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

from mock import patch
from cap.modules.mail.attributes import generate_recipients, generate_message, \
    generate_subject


@patch('cap.modules.mail.users.current_user')
def test_generate_recipients(mock_user, app, users, location, create_schema, create_deposit):
    user = users['cms_user']
    mock_user.email = user.email

    config = {
        "recipients": {
            "owner": True,
            "current_user": True,
            "conditions": [{
                "op": "and",
                "checks": [
                    {
                        "path": "ml_app_use",
                        "if": "exists",
                        "value": True,
                    }
                ],
                "mails": ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"]
            }],
            "default": ['default@cern0.ch'],
            "type": "cc"
        }
    }
    create_schema('test', experiment='CMS', config=config)
    deposit = create_deposit(user, 'test',
                             {
                                 '$ana_type': 'test',
                                 'general_title': 'Test',
                                 'ml_app_use': True
                             },
                             experiment='CMS',
                             publish=True)

    recipients, recipient_type = generate_recipients(deposit, config)
    assert recipient_type == 'cc'
    assert set(recipients) == {'ml-conveners-jira-test@cern0.ch', 'cms_user@cern.ch',
                               'ml-conveners-test@cern0.ch', 'default@cern0.ch'}


@patch('cap.modules.mail.users.current_user')
def test_generate_message(mock_user, app, users, location, create_schema, create_deposit):
    user = users['cms_user']
    mock_user.email = user.email

    config = {
        "message": {
            "template": "mail/message/message_published.html",
            "ctx": {
                "cadi_id": {
                    "type": "path",
                    "path": "analysis_context.cadi_id"
                },
                "title": {
                    "type": "path",
                    "path": "general_title"
                },
                "questionnaire_url": {
                    "type": "method",
                    "method": "create_questionnaire_url"
                },
                "submitter_mail": {
                    "type": "method",
                    "method": "get_submitter_mail"
                }
            }
        }
    }
    create_schema('test', experiment='CMS', config=config)
    deposit = create_deposit(user, 'test',
                             {
                                 '$ana_type': 'test',
                                 'general_title': 'Test',
                                 'analysis_context': {
                                     'cadi_id': 'ABC-11-111'
                                 },
                             },
                             experiment='CMS',
                             publish=True)

    message = generate_message(deposit, config, 'publish')
    assert 'CADI URL: https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=ABC-11-111' in message
    assert 'Title: Test' in message
    assert 'Submitted by cms_user@cern.ch.' in message


@patch('cap.modules.mail.users.current_user')
def test_generate_subject(mock_user, app, users, location, create_schema, create_deposit):
    user = users['cms_user']
    mock_user.email = user.email

    config = {
        "subject": {
            "template": "mail/subject/subject_published.html",
            "ctx": {
                "cadi_id": {
                    "type": "path",
                    "path": "analysis_context.cadi_id"
                },
                "revision": {
                    "type": "path",
                    "path": "_deposit.pid.revision_id"
                }
            }
        }
    }
    create_schema('test', experiment='CMS', config=config)
    deposit = create_deposit(user, 'test',
                             {
                                 '$ana_type': 'test',
                                 'analysis_context': {
                                     'cadi_id': 'ABC-11-111'
                                 },
                             },
                             experiment='CMS',
                             publish=True)

    subject = generate_subject(deposit, config, 'publish')
    assert subject == 'Questionnaire for ABC-11-111 - New Published Analysis | CERN Analysis Preservation'