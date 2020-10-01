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
"""Experiments permissions."""

from flask_principal import ActionNeed
from invenio_access.permissions import Permission
from invenio_access import action_factory


def exp_permission_factory(experiment):
    """Experiment permission factory."""
    return Permission(
        ActionNeed('{}-access'.format(experiment.lower()))
    )


def exp_need_factory(experiment):
    """Experiment need factory."""
    return ActionNeed(('{}-access'.format(experiment.lower())))


cms_access_action = exp_need_factory('CMS')
lhcb_access_action = exp_need_factory('LHCb')
alice_access_action = exp_need_factory('ALICE')
atlas_access_action = exp_need_factory('ATLAS')

cms_permission = exp_permission_factory('CMS')
lhcb_permission = exp_permission_factory('LHCb')
alice_permission = exp_permission_factory('ALICE')
atlas_permission = exp_permission_factory('ATLAS')

# questionnaire actions
cms_pag_convener_action = action_factory(
    'cap-cms-pag-conveners', parameter=True)
cms_pag_convener_action_all = cms_pag_convener_action(None)
