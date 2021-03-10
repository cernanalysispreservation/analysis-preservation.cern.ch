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
"""Tests for mail."""
from pytest import mark, raises
from cap.modules.mail.post import send_mail_on_publish, create_and_send


def test_create_and_send_no_recipients_fails(app):
    with raises(AssertionError):
        create_and_send(None, None, 'Test subject', [])


@mark.skip
def test_send_mail_published(app, users, create_deposit):
    user = users['alice_user']
    published = create_deposit(user, 'alice-analysis-v0.0.1', publish=True)
    depid = published['_deposit']['id'],
    recid = published['_deposit']['pid']['value']

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:

            send_mail_on_publish(
                depid=depid,
                recid=recid,
                url='test-url'
            )

            assert len(outbox) == 1
            assert outbox[0].sender == app.config['MAIL_DEFAULT_SENDER']
            assert outbox[0].html == f"""<html lang="en">
                <head>
                    <title>CAP Mail Template</title>
                </head>
                <body>
                    <img src="https://i.imgur.com/ZPr3zRp.png" width="200"/>
                    <div class="container">
    
              <h4> An analysis has been published, with id <em>{recid}</em>.</h4>
              <p>You can check the analysis <a href="test-url/published/{recid}">here</a>.</p>
    
                    </div>
                </body>
            </html>
            """
