# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM exiasr/alpine-yarn-nginx

ENV WORKING_DIR=/tmp/cap
ENV WWW_DIR=/www

RUN apk update
RUN apk add git yarn python g++ make && rm -rf /var/cache/apk/*

# We invalidate cache always because there is no easy way for now to detect
# if something in the whole git repo changed. For docker git clone <url> <dir>
# is always the same so it caches it.

# get the code at a specific commit
RUN git clone https://github.com/pamfilos/cap-api-docs.git $WORKING_DIR/

WORKDIR $WORKING_DIR

RUN npm install
RUN npm run build

RUN cp -rf ./web_deploy /var/www
RUN cp -rf ./docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
