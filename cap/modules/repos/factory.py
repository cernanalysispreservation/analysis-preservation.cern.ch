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
"""Git API factory."""
from .errors import GitHostNotSupported
from .github_api import GithubAPI
from .gitlab_api import GitlabAPI


def host_to_git_api(host):
    return {
        'github.com': GithubAPI,
        'gitlab.cern.ch': GitlabAPI,
        'gitlab.com': GitlabAPI,
    }[host]


def create_git_api(host, owner, repo, branch='master', user_id=None):
    try:
        return host_to_git_api(host)(
            host, owner, repo, branch, user_id
        )
    except KeyError:
        raise GitHostNotSupported
