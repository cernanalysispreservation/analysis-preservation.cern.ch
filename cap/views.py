# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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

"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template
from flask_login import login_user, current_user, UserMixin

blueprint = Blueprint(
    'cap',
    __name__,
    template_folder='templates',
    static_folder='static',
)


@blueprint.route('/', defaults={'path': ''})
@blueprint.route('/<path:path>')
def index(path):
    return render_template('cap/app_base.html')


class User(UserMixin):
    """Class for creating a test user."""

    def __init__(self, id, email, password, active=True):
        self.id = id
        self.password = password
        self.email = email
        self.active = active

    def get_id(self):
        return self.id

    @property
    def is_active(self):
        return self.active


# (TODO) Remove this when REACT module is completed
@blueprint.route('/login_app', methods=['POST'])
def login():
    user = User(id=1, email='cms@inveniosoftware.org', password='cmscms')
    login_user(user)
    return current_user.email
