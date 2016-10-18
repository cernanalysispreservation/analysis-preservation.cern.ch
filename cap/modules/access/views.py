# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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

"""Access blueprint in order to dispatch the login request."""

from __future__ import absolute_import, print_function

from functools import wraps

from flask import Blueprint, current_app, g, redirect, session, url_for, abort
from flask_login import current_user
from flask_principal import AnonymousIdentity, RoleNeed, identity_loaded

from cap.utils import obj_or_import_string
from cap.modules.experiments.permissions import collaboration_permissions


access_blueprint = Blueprint('cap_access', __name__,
                             url_prefix='/access',
                             template_folder='templates')


def redirect_user_to_experiment(f):
    """Decorator for redirecting users to their experiments."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        experiments = get_user_experiments()
        collab_pages = current_app.config.get('CAP_COLLAB_PAGES', {})

        # if user is in more than one experiment, he won't be redirected
        if len(experiments) == 1:
            return redirect(url_for(collab_pages[experiments[0]]))
        else:
            return f(*args, **kwargs)

    return decorated_function


def get_user_experiments():
    """Return an array with user's experiments."""
    experiments = [collab for collab, needs in
                   collaboration_permissions.items() if needs.can()]
    return experiments
