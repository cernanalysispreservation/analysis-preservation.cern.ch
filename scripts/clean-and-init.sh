#!/usr/bin/env sh
#
# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017, 2018 CERN.
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


# Destroy db and indexes
cap db destroy --yes-i-know

# Flush redis cache
redis-cli flushall

# Init and create db and indexes
cap db init
cap alembic upgrade heads

# Create default location for files
if [[ -z "${DEBUG}" ]]; then
  cap files location local var/data --default
  curl -XDELETE http://localhost:9200/_all
fi

# install demo users
cap users create info@inveniosoftware.org -a --password infoinfo

cap users create cms@inveniosoftware.org -a --password cmscms
cap users create lhcb@inveniosoftware.org -a --password lhcblhcb
cap users create atlas@inveniosoftware.org -a --password atlasatlas
cap users create alice@inveniosoftware.org -a --password alicealice

cap roles create cms-members@cern.ch
cap roles create alice-member@cern.ch
cap roles create atlas-active-members-all@cern.ch
cap roles create lhcb-general@cern.ch
cap roles create analysis-preservation-support@cern.ch
cap roles create data-preservation-admins@cern.ch


cap roles add info@inveniosoftware.org analysis-preservation-support@cern.ch
cap access allow superuser-access role analysis-preservation-support@cern.ch
cap access allow superuser-access role data-preservation-admins@cern.ch

cap roles add cms@inveniosoftware.org cms-members@cern.ch
cap roles add alice@inveniosoftware.org alice-member@cern.ch
cap roles add atlas@inveniosoftware.org atlas-active-members-all@cern.ch
cap roles add lhcb@inveniosoftware.org lhcb-general@cern.ch

cap access allow cms-access role cms-members@cern.ch
cap access allow lhcb-access role lhcb-general@cern.ch
cap access allow alice-access role alice-member@cern.ch
cap access allow atlas-access role atlas-active-members-all@cern.ch

# test user (with no privileges)
cap users create test@inveniosoftware.org -a --password testtest
cap roles create test-users@cern.ch
cap roles add test@inveniosoftware.org test-users@cern.ch

# install schemas in db at the end, so that all the roles exist
cap fixtures schemas