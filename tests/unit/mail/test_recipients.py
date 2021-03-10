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
from cap.modules.mail.utils import generate_recipients


@patch('cap.modules.mail.users.current_user')
def test_mail_recipients(mock_user, users, location, create_schema, create_deposit):
    mock_user.email = 'cms_user@cern.ch'
    config = {
        "notifications": {
            "actions": {
                "publish": {
                    "recipients": {
                        "func": "get_cms_stat_recipients",
                        "current_user": True,
                        "conditions": [
                            {
                                "path": "foo",
                                "if": ["exists"],
                                "values": [True],
                                "op": "and",
                                "mail": "foo-test@cern.ch"
                            }, {
                                "path": "bar.bar2",
                                "if": ["equals"],
                                "values": ['YEAH'],
                                "op": "and",
                                "mail": "bar-test@cern.ch"
                            }, {
                                "path": "bar.bar3",
                                "if": ["exists", "is_not_in"],
                                "values": [True, 'this should not be in here'],
                                "op": "and",
                                "mail": "not-here@cern.ch"
                            }, {
                                "path": "bar.bar4",
                                "if": ["exists", "is_not_in"],
                                "values": [True, 'this should not be in here'],
                                "op": "and",
                                "mail": "not-here@cern.ch"
                            }
                        ],
                        "default": ["some-recipient@cern.ch"]
                    }
                }
            }
        }
    }

    user = users['cms_user']
    create_schema('test', experiment='CMS', config=config)
    deposit = create_deposit(
        user, 'test',
        {
            "$schema": "https://analysispreservation.cern.ch/schemas/deposits/records/test-v1.0.0.json",
            'foo': ['it', 'exists'],
            'bar': {
                'bar2': 'YEAH',
                'bar3': ['hello', 'world']
            },
            'analysis_context': {
                'cadi_id': 'ABC-12-123'
            }
        },
        experiment='CMS',
        publish=True
    )

    recipients = generate_recipients(deposit, config['notifications']['actions']['publish'])
    assert set(recipients) == {"some-recipient@cern.ch", "not-here@cern.ch",
                               "bar-test@cern.ch", "foo-test@cern.ch",
                               "cms_user@cern.ch", "hn-cms-ABC-12-123@cern0.ch"}
