#!/usr/bin/env bash
# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

# pydocstyle cap && \
python setup.py test && \
cd ui && yarn prebuild

#pydocstyle cap tests docs && \
#isort -rc -c -df && \
# check-manifest --ignore ".travis-*,docs/_build*" && \
# sphinx-build -qnNW docs docs/_build/html && \
