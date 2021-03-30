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
from cap.modules.mail.custom.messages import get_cms_stat_message, get_review_message


@patch('cap.modules.mail.custom.messages.get_current_user')
def test_publish(mock_user, app, users, location, create_schema, create_deposit):
    mock_user.return_value = 'cms_user@cern.ch'
    user = users['cms_user']

    create_schema('test', experiment='CMS')
    deposit = create_deposit(user, 'test',
                             {'$ana_type': 'test', 'general_title': 'Test'},
                             experiment='CMS', publish=True)

    message = get_cms_stat_message(deposit, 'https://test.cern.ch/')
    assert message == f"Title: Test\n" \
                      f"CADI URL: None\n" \
                      f"Questionnaire URL: https://test.cern.ch/published/{deposit['control_number']}\n" \
                      f"Submitted by cms_user@cern.ch."


@patch('cap.modules.mail.custom.messages.get_current_user')
def test_review(mock_user, app, users, location, create_schema, create_deposit):
    mock_user.return_value = 'test@cern.ch'
    user = users['cms_user']

    create_schema('test', experiment='CMS')
    deposit = create_deposit(user, 'test',
                             {'$ana_type': 'test', 'general_title': 'Test'},
                             experiment='CMS')

    message = get_review_message(deposit, 'https://test.cern.ch/')
    assert message == f"Title: Test\n" \
                      f"CADI URL: None\n" \
                      f"Questionnaire URL: https://test.cern.ch/drafts/{deposit['_deposit']['id']}\n" \
                      f"Submitted by cms_user@cern.ch, and reviewed by test@cern.ch."
