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
"""CAP Deposit utils."""

from __future__ import absolute_import, print_function

from flask import current_app
from celery import shared_task
from invenio_access.models import Role
from invenio_db import db

from cap.modules.records.utils import url_to_api_url


def clean_empty_values(data):
    """Remove empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {
        k: v
        for k, v in ((k, clean_empty_values(v)) for k, v in data.items()) if v
    }


def extract_actions_from_class(record_class):
    """Extract actions from class."""
    for name in dir(record_class):
        method = getattr(record_class, name, None)
        if method and getattr(method, '__deposit_action__', False):
            yield method.__name__


def add_read_permission_for_egroup(deposit, egroup):
    """Add read permission for egroup."""
    role = Role.query.filter_by(name=egroup).one()
    deposit._add_egroup_permissions(role, ['deposit-read'], db.session)
    deposit.commit()
    db.session.commit()


def fix_bucket_links(response):
    """Add /api/ to the bucket and object links."""
    def add_api_to_links(links):
        return {k: url_to_api_url(v)
                for k, v in links.items()} \
            if links else {}

    # bucket links
    response['links'] = add_api_to_links(response.get('links'))

    # object version links
    if response.get('contents'):
        for item in response['contents']:
            item['links'] = add_api_to_links(item.get('links'))

    return response


@shared_task(ignore_result=True)
def index_record(record_uuid):
    """Index a single record."""
    from cap.modules.deposit.search import CAPIndexer
    CAPIndexer().index_by_id(record_uuid)


def index_deposit_receiver(sender, action=None, pid=None, deposit=None,
                           *args, **kwargs):
    """
    Index the record after publishing. To be used as a task after it is
    triggered by the `post_action` signal.
    """
    if action == 'publish':
        _, record = deposit.fetch_published()
        index_record.delay(str(record.id))
