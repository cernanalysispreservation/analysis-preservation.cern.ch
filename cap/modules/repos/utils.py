# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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
"""Importer utils."""
from __future__ import absolute_import, print_function

import random
import re
import shutil
import string
from tempfile import SpooledTemporaryFile

from flask import current_app, url_for, render_template
from flask_login import current_user
from invenio_db import db
from sqlalchemy.orm.exc import NoResultFound

from cap.modules.records.utils import url_to_api_url

from .errors import GitIntegrationError, GitURLParsingError, GitPRParsingError
from .models import GitRepository, GitWebhook, GitWebhookSubscriber


def parse_git_url(url):
    """Parse a git url, and extract the associated information."""
    git_regex = re.compile(
        '''
        (?:https|http)://
        (?P<host>(?:github\.com|gitlab\.cern\.ch|gitlab\.com))
        [:|\/]
        (?P<owner>[\w-]+)\/
        (?P<repo>[\w\.-]+)
        (?:\.git|/tree/|/-/tree/|/blob/|/-/blob/|/releases/tag/|/-/tags/)?/?
        (?P<branch>[\w.-]+)?/?
        (?P<filepath>.+)?
    ''', re.VERBOSE | re.MULTILINE | re.IGNORECASE)

    try:
        host, owner, repo, branch, filepath = re.match(git_regex, url).groups()

        # need to avoid PRs, but if blob/ is there
        # it can be a path inside the repo
        if any(path in url for path in [f'{repo}/pull',
                                        f'{repo}/-/merge_requests']) \
                and f'blob/{branch}' not in url:
            raise GitPRParsingError

    except (ValueError, TypeError, AttributeError):
        raise GitURLParsingError

    return host, owner, repo, branch, filepath


def ensure_content_length(resp):
    """
    Add Content-Length when it is not present.

    Streams content into a temp file, and replaces the original socket with it.
    """
    spool = SpooledTemporaryFile(current_app.config.get('FILES_URL_MAX_SIZE'))
    shutil.copyfileobj(resp.raw, spool)
    resp.headers['Content-Length'] = str(spool.tell())
    spool.seek(0)

    # replace the original socket with temp file
    resp.raw._fp.close()
    resp.raw._fp = spool
    return resp


def create_webhook(record_id, api, type_=None):
    """
    Create webhook.

    By passing the connected git api, we can download the repo and associated
    metadata, and create a webhook that will automatically update the db
    if a repo remote changes.
    """
    with db.session.begin_nested():
        # release event cannot be on branch
        branch = None if type_ == 'release' else api.branch
        repo = GitRepository.create_or_get(
            api.repo_id, api.host, api.owner, api.repo)

        try:
            webhook = GitWebhook.query.filter_by(
                event_type=type_, repo_id=repo.id, branch=branch).one()

        except NoResultFound:
            if type_:
                hook_id, hook_secret = api.create_webhook(type_)
                webhook = GitWebhook(
                    event_type=type_, repo_id=repo.id, branch=branch,
                    external_id=hook_id, secret=hook_secret)
            else:
                webhook = GitWebhook(repo_id=repo.id, branch=branch)

            db.session.add(webhook)

        try:
            GitWebhookSubscriber.query.filter_by(
                record_id=record_id,
                user_id=current_user.id,
                webhook_id=webhook.id
            ).one()

            if type_:
                raise GitIntegrationError(
                    f'Analysis already connected with {type_} webhook.')

        except NoResultFound:
            subscriber = GitWebhookSubscriber(
                record_id=record_id,
                user_id=current_user.id)
            webhook.subscribers.append(subscriber)

    db.session.commit()


def get_webhook_url():
    """Return endpoint for repositories webhooks."""
    if current_app.config.get('DEBUG'):
        assert 'WEBHOOK_NGROK_URL' in current_app.config
        return current_app.config['WEBHOOK_NGROK_URL']
    else:
        return url_to_api_url(
            url_for(current_app.config['WEBHOOK_ENDPOINT'], _external=True))


def generate_secret():
    """Create a random string to be used as a secret token for webhooks."""
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for i in range(32))


def disconnect_subscriber(sub_id):
    sub = GitWebhookSubscriber.query.filter_by(id=sub_id).one()
    sub.status = 'deleted'
    db.session.commit()


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


def populate_template_from_ctx(record, config, module=None):
    """
    Render a template according to the context provided in the schema.
    Args:
        record: The analysis record that has the necessary fields.
        config: The analysis config, provided in the `schema`.
        module: The file that will hold the custom created functions.

    Returns: The rendered string, using the required context values.
    """
    if not config:
        raise GitIntegrationError('No config provided for repo creation.')

    config_ctx = config.get('ctx', {})
    template = config.get('template')

    if not template:
        raise GitIntegrationError('No template provided for repo creation.')

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
