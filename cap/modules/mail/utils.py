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

from flask import render_template, render_template_string, current_app, abort
from jinja2.exceptions import TemplateNotFound

CONFIG_DEFAULTS = {
    'review': {
        'subject': 'New Review on Analysis | CERN Analysis Preservation',
        'template': ('mail/analysis_review.html', None)
    },
    'publish': {
        'subject': 'New Published Analysis | CERN Analysis Preservation',
        'template': ('mail/analysis_published.html', None)
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
    template_file = config.get('template_file')

    if template:
        render = render_template_string

    if template_file:
        render = render_template
        template = template_file

    if not (template or template_file):
        return CONFIG_DEFAULTS[action][type]

    ctx = {}
    for attrs in config_ctx:
        if attrs['type'] == 'path':
            name = attrs['name']
            val = path_value_equals(attrs['path'], record)
        else:
            name = attrs['method']
            custom_func = getattr(module, name)
            val = custom_func(record, config)

        ctx.update({name: val})
    try:
        return render(template, **ctx)
    except TemplateNotFound as ex:
        msg = f'Template {ex.name} not found. Notification procedure aborted.'
        current_app.logger.error(msg)
        abort(404, msg)


def update_mail_list(record, config, mails):
    mails_list = config.get('default')
    formatted_list = config.get('formatted')

    if mails_list:
        mails += mails_list
    if formatted_list:
        mails += [
            populate_template_from_ctx(record, formatted)
            for formatted in formatted_list
        ]
