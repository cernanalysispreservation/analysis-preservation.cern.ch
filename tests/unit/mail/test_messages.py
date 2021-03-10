# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
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
from cap.modules.mail.utils import generate_message


@patch('cap.modules.mail.custom.messages.get_current_user')
def test_mail_messages(mock_user, app, users, location, create_schema, create_deposit):
    mock_user.return_value = 'cms_user@cern.ch'
    config = {
        "notifications": {
            "actions": {
                "publish": {
                    "message": {
                        "default": "Hello World! ",
                        "func": "get_cms_stat_message"
                    }
                }
            }
        }
    }

    user = users['cms_user']
    create_schema('test', experiment='CMS', config=config)
    deposit = create_deposit(user, 'test-v0.0.1', experiment='CMS', publish=True)

    message = generate_message(deposit, config['notifications']['actions']['publish'])
    assert message == 'Hello World! Submitted by cms_user@cern.ch'
