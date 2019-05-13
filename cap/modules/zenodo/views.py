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


"""CAP Zenodo views."""

import requests

from flask import Blueprint, current_app, jsonify
from invenio_files_rest.models import FileInstance, ObjectVersion


zenodo_bp = Blueprint('cap_zenodo',
                      __name__,
                      url_prefix='/zenodo'
                      )


@zenodo_bp.route('/<bucket_id>/<filename>')
def upload_to_zenodo(bucket_id, filename):
    """Upload code to zenodo."""
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    params = {"access_token": current_app.config.get(
        'ZENODO_ACCESS_TOKEN')}
    filename = filename + '.tar.gz'

    r = requests.post(zenodo_server_url,
                      params=params, json={},
                      )

    file_obj = ObjectVersion.get(bucket_id, filename)
    file = FileInstance.get(file_obj.file_id)

    bucket_url = r.json()['links']['bucket']
    with open(file.uri, 'rb') as fp:
        response = requests.put(
            bucket_url + '/{}'.format(filename),
            data=fp,
            params=params,
        )

    return jsonify({"status": response.status_code})
