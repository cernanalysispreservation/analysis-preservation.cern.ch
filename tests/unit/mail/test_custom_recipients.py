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
from cap.modules.mail.custom.recipients import get_review_recipients, get_cms_stat_recipients


def test_publish(app, users, location, create_schema, create_deposit):
    user = users['cms_user']
    create_schema('test', experiment='CMS')
    deposit = create_deposit(user, 'test',
                             {
                                 '$ana_type': 'test',
                                 'general_title': 'Test',
                                 'analysis_context': {
                                     'cadi_id': 'ABC-12-123'
                                 }
                             },
                             experiment='CMS', publish=True)

    recipients = get_cms_stat_recipients(deposit)
    assert recipients == ['hn-cms-ABC-12-123@cern0.ch']


@patch('cap.modules.mail.custom.recipients.check_for_permission')
def test_review(mock_check, app, users, location, create_schema, create_deposit):
    mock_check.return_value = True
    user = users['cms_user']
    create_schema('test', experiment='CMS')
    deposit = create_deposit(user, 'test',
                             {
                                 '$ana_type': 'test',
                                 'general_title': 'Test',
                                 'analysis_context': {
                                     'cadi_id': 'ABC-12-123'
                                 }
                             },
                             experiment='CMS', publish=True)

    recipients = get_review_recipients(deposit)
    assert recipients == ['hn-cms-ABC-12-123@cern0.ch']
