# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Resolver JSON for default JSON Schemas."""

from __future__ import absolute_import, print_function

import json
import os

import jsonresolver


@jsonresolver.route('/records/jsonschemas/definitions/<path:jsonschema>',
                    host='analysis-preservation.cern.ch')
def resolve_definitions(jsonschema):
    """Resolve the JSON definition schema."""
    jsonschema_definition_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                              'jsonschemas', 'definitions',
                                              jsonschema)
    with open(jsonschema_definition_path) as file:
        jsonschema_definition = file.read()
    return json.loads(jsonschema_definition)
