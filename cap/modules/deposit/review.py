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
"""Serializer for deposit reviews."""

from __future__ import absolute_import, print_function

from marshmallow import Schema, fields, validate

import uuid
from flask_login import current_user
from .errors import ReviewError, ReviewValidationError
from cap.modules.user.utils import get_user_email_by_id


class ReviewSchema(Schema):
    """Schema for deposit review."""
    type = fields.Str(validate=validate.OneOf(
        ["approved", "request_changes", "declined"]),
                      required=True)
    body = fields.Str()
    id = fields.Str(required=True)
    reviewer = fields.Method('get_reviewer', dump_only=True)
    comments = fields.Str()
    resolved = fields.Bool(default=False)

    def get_reviewer(self, obj):
        return get_user_email_by_id(obj['reviewer'])


class ReviewCreatePayload(Schema):
    """Schema for deposit review."""
    type = fields.Str(validate=validate.OneOf(
        ["approved", "request_changes", "declined"]),
                      required=True)
    body = fields.Str()


class ReviewUpdatePayload(Schema):
    """Schema for deposit review."""
    id = fields.Str(required=True)
    action = fields.Str(validate=validate.OneOf(
        ["comment", "delete", "resolve"]),
                        required=True)
    comments = fields.Str()


class Reviewable(object):
    def schema_is_reviewable(self):
        config = self.schema.config
        return config.get('reviewable', False)

    def create_review(self, data):
        new_review, errors = ReviewCreatePayload().load(data=data)

        if errors:
            raise ReviewValidationError(None, errors=errors)
        else:
            new_uuid = uuid.uuid4()
            new_review["id"] = str(new_uuid)
            new_review["reviewer"] = current_user.id

            _review = self.get("_review", [])
            _review.append(new_review)
            self["_review"] = _review

    def update_review(self, data):
        payload, errors = ReviewUpdatePayload().load(data=data)

        reviews = self.get("_review", [])

        if errors:
            raise ReviewValidationError(None, errors=errors)
        else:
            review = None
            for i, r in enumerate(reviews):
                if r.get("id", None) == payload["id"]:
                    review = r
                    review_index = i
                    break

            if not review:
                raise ReviewError("Review 'id' passed is not correct")

            if payload["action"] == "resolve":
                reviews[review_index]["resolved"] = True
            elif payload["action"] == "delete":
                del reviews[review_index]
            elif payload["action"] == "comment":
                pass

            self["_review"] = reviews
