# -*- coding: utf-8 -*-

"""CAP Services blueprint."""

from __future__ import absolute_import, print_function

from flask import Blueprint


blueprint = Blueprint('cap_services',
                      __name__,
                      url_prefix='/services'
                      )

from . import zenodo, cern, orcid, status_checks, ror, cds, latex, notebook  # noqa
