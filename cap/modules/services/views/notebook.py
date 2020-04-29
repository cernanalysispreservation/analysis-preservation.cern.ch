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


"""CAP NBViewer service views."""

import nbformat
from flask import request, jsonify
from nbconvert import HTMLExporter
from nbconvert.writers import FilesWriter

from invenio_files_rest.models import ObjectVersion
from invenio_pidstore.resolver import Resolver

from . import blueprint
from cap.modules.access.utils import login_required
from cap.modules.deposit.api import CAPDeposit


JSON_HEADERS = {'Content-Type': 'application/json'}


@blueprint.route('/notebook', methods=['POST'])
@login_required
def render_notebook():
    """Get ORCID for given name (route)."""

    data = request.get_json()
    name = data.get('name')
    pid = data.get('pid')

    # get deposit and file bucket
    resolver = Resolver(pid_type='depid',
                        object_type='rec',
                        getter=lambda x: x)

    _, uuid = resolver.resolve(pid)
    deposit = CAPDeposit.get_record(uuid)
    obj = ObjectVersion.get(deposit.files.bucket.id, name)

    # extract nb node
    nb_file = open(obj.file.uri)
    nb_content = nb_file.read()
    nb_node = nbformat.reads(nb_content, as_version=4)

    # export html
    exporter = HTMLExporter()
    body, resources = exporter.from_notebook_node(nb_node)

    # writer = FilesWriter()
    # writer.write(output=body,
    #              resources=resources,
    #              notebook_name=name)

    return jsonify({'notebook': body}), 200
