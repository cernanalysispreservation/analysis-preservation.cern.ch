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

from flask import render_template
from flask_principal import RoleNeed
from invenio_access.permissions import Permission

CONFIG_DEFAULTS = {
    'subject': {
        'review': "New Review on Analysis | CERN Analysis Preservation",
        'publish': "New Published Analysis | CERN Analysis Preservation"
    },
    'template': {
        'review': ("mail/analysis_review.html", None),
        'publish': ("mail/analysis_published.html", None),
    }
}


def path_value_equals(element, JSON):
    """Given a string path, retrieve the JSON item."""
    paths = element.split(".")
    data = JSON
    try:
        for i in range(0, len(paths)):
            data = data[paths[i]]
    except KeyError:
        return None
    return data


def create_analysis_url(deposit):
    """
    Create the url of the analysis, depending on whether
    it is published or not. Used to access it through a URL.
    """
    status = deposit['_deposit']['status']

    if status == 'draft':
        return f'drafts/{deposit["_deposit"]["id"]}'
    return f'published/{deposit["control_number"]}'


def check_for_permission(email):
    return Permission(RoleNeed(email)).can()


def populate_template_from_ctx(record, config, action=None,
                               module=None, type=None):
    """
    Render a template according to the context provided in the schema.
    Args:
        record: The analysis record that has the necessary fields.
        config: The analysis config, provided in the `schema`.
        action: THe action that triggered the notification (e.g. `publish`).
        module: The file that will hold the custom created functions.

    Returns: The rendered string, using the required context values.
    """
    config_ctx = config.get('ctx', {})
    template = config.get('template')

    if not template:
        return CONFIG_DEFAULTS[type][action]

    ctx = {}
    for key_attrs in config_ctx.items():
        key = key_attrs[0]
        attrs = key_attrs[1]

        if attrs['type'] == 'path':
            val = path_value_equals(attrs['path'], record)
        else:
            custom_func = getattr(module, attrs['method'])
            val = custom_func(record, config)

        ctx.update({key: val})

    return render_template(template, **ctx)
