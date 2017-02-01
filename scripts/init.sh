#!/usr/bin/env sh
#
# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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

# Create database and tables:
cap db init
cap db create

# Create default user:
cap users create info@inveniosoftware.org -a --password infoinfo

cap users create cms@cap.ch -a --password cmscms
cap users create lhcb@cap.ch -a --password lhcblhcb
cap users create atlas@cap.ch -a --password atlasatlas
cap users create alice@cap.ch -a --password alicealice

cap roles create cms-members@cern.ch
cap roles create alice-member@cern.ch
cap roles create atlas-active-members-all@cern.ch
cap roles create lhcb-general@cern.ch

cap roles add info@inveniosoftware.org cms-members@cern.ch
cap roles add info@inveniosoftware.org alice-member@cern.ch
cap roles add info@inveniosoftware.org atlas-active-members-all@cern.ch
cap roles add info@inveniosoftware.org lhcb-general@cern.ch

cap roles add cms@cap.ch cms-members@cern.ch
cap roles add alice@cap.ch alice-member@cern.ch
cap roles add atlas@cap.ch atlas-active-members-all@cern.ch
cap roles add lhcb@cap.ch lhcb-general@cern.ch

# Create indexes:
cap index init

# Create location for files:
cap files location local var/data --default

# Create collections:
cap collections create CERNAnalysisPreservation
cap collections create CMS -p CERNAnalysisPreservation
cap collections create CMSQuestionnaire -p CMS -q '_type:cmsquestionnaire'
cap collections create CMSAnalysis -p CMS -q '_type:cmsanalysis'
cap collections create LHCb -p CERNAnalysisPreservation
cap collections create LHCbAnalysis -p LHCb -q '_type:lhcbanalysis'
cap collections create ATLAS -p CERNAnalysisPreservation
cap collections create ATLASWorkflows -p ATLAS -q '_type:atlasworkflows'
cap collections create ATLASAnalysis -p ATLAS -q '_type:atlasanalysis'
cap collections create ALICE -p CERNAnalysisPreservation
