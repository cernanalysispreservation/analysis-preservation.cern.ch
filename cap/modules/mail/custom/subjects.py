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

from .utils import create_base_subject


def get_cms_stat_subject(record, config=None):
    recid, record = record.fetch_published()
    revision = record.revision_id

    cadi_id = record.get("analysis_context", {}).get("cadi_id")
    subject = create_base_subject(config, cadi_id)

    if revision > 0:
        subject += "New Version of Published Analysis | CERN Analysis Preservation"  # noqa
    else:
        subject += "New Published Analysis | CERN Analysis Preservation"

    return subject


def get_review_subject(record, config=None):
    cadi_id = record.get("analysis_context", {}).get("cadi_id")
    subject = create_base_subject(config, cadi_id)
    subject += 'New Review on Analysis | CERN Analysis Preservation'

    return subject
