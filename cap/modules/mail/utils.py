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

import re

from flask import current_app
from flask_login import current_user
from flask_principal import RoleNeed

from invenio_accounts.models import User
from invenio_access.permissions import Permission

from cap.modules.mail.tasks import create_and_send


def path_value_equals(element, JSON):
    paths = element.split(".")
    data = JSON
    try:
        for i in range(0, len(paths)):
            data = data[paths[i]]
    except KeyError:
        return None

    return data


def create_analysis_url(deposit):
    status = deposit['_deposit']['status']
    return f'drafts/{deposit["_deposit"]["id"]}' if status == 'draft'\
        else f'published/{deposit["control_number"]}'


def create_base_message(deposit, host_url, params=None):
    cadi = f"CADI URL: https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=" \
           f"{deposit.get('analysis_context', {}).get('cadi_id')}\n"
    title = f"Title: {deposit.get('general_title')}\n"
    quest = f"Questionnaire URL : {host_url}{create_analysis_url(deposit)}\n"

    msg = f"{title}{cadi}{quest}"

    if params:
        stats_assignee = f"Statistics Committee assignee: " \
                         f"{params.get('primary', '-')} (primary), " \
                         f"{params.get('secondary', '-')} (secondary)\n"
        msg += stats_assignee

    return msg


def create_base_subject(config, cadi_id, recid=None):
    if not recid:
        return f"Questionnaire for {cadi_id} - " \
            if cadi_id else config.get("email_subject")
    else:
        return f"Questionnaire for {cadi_id} {recid} - " \
            if cadi_id else f"Questionnaire for {recid} - "


def add_hypernews_mail_to_recipients(recipients, cadi_id):
    # mail for reviews - Hypernews
    # should be sent to hn-cms-<cadi-id>@cern.ch if well-formed
    cadi_regex = current_app.config.get("CADI_REGEX")
    hypernews_mail = current_app.config.get("CMS_HYPERNEWS_EMAIL_FORMAT")

    if re.match(cadi_regex, cadi_id) and hypernews_mail:
        recipients.append(hypernews_mail.format(cadi_id))


def get_review_recipients(deposit, host_url, config):
    # mail of owner
    owner = deposit["_deposit"]["owners"][0]
    owner_mail = User.query.filter_by(id=owner).one().email

    # mail of reviewer
    reviewer_mail = current_user.email
    recipients = [owner_mail, reviewer_mail]

    cadi_id = deposit.get("analysis_context", {}).get("cadi_id")
    if cadi_id:
        # if cadi mail Hypernews if review from admin reviewer (stat committee)
        cms_stats_commitee_email = current_app.config.get(
            "CMS_STATS_QUESTIONNAIRE_ADMIN_ROLES"
        )

        # check that current user is an admin reviewer
        if (cms_stats_commitee_email and
                Permission(RoleNeed(cms_stats_commitee_email)).can()):
            add_hypernews_mail_to_recipients(recipients, cadi_id)

    subject = create_base_subject(config, cadi_id)
    message = create_base_message(deposit, host_url)
    message += f"Submitted by {owner_mail}, and reviewed by {reviewer_mail}."

    return subject, message, recipients


def get_cms_stat_recipients(record, host_url, config):
    data = current_app.config.get("CMS_STATS_COMMITEE_AND_PAGS")
    key = path_value_equals(config.get("path", ""), record)
    recipients = data.get(key, {}).get("contacts", [])
    params = data.get(key, {}).get("params", {})

    # submitter email
    recipients.append(current_user.email)

    # mail for PDF forum
    pdf_mail = current_app.config.get("PDF_FORUM_MAIL")
    if pdf_mail and record.get("parton_distribution_functions", None):
        recipients.append(pdf_mail)

    # mail for ML surveys - CMS conveners
    conveners_ml_mail = current_app.config.get("CONVENERS_ML_MAIL")
    conveners_ml_jira_mail = current_app.config.get("CONVENERS_ML_JIRA_MAIL")

    # Some extra info for the CMS conveners recipients:
    # 1. if uses centralized CMS ML applications (3.3) (not empty)
    # 2. if 3.4 = Yes (mva_use = Yes)
    # 3. if the user adds an app to 3.a (ml_app_use - not empty)
    # 4. or if the user answers to 3.b (ml_survey.options = Yes)
    centralized_apps = (
        record.get("multivariate_discriminants", {})
        .get("use_of_centralized_cms_apps", {})
        .get("options", [])
    )
    mva_use = record.get("multivariate_discriminants", {}).get("mva_use")
    ml_app_use = record.get("ml_app_use", [])
    ml_survey = record.get("ml_survey", {}).get("options")

    if conveners_ml_mail and (
        (centralized_apps and 'No' not in centralized_apps) or mva_use == 'Yes' or  # noqa
        ml_app_use or ml_survey == 'Yes'  # noqa
    ):
        recipients += [conveners_ml_mail, conveners_ml_jira_mail]

    cadi_id = record.get("analysis_context", {}).get("cadi_id")
    if cadi_id:
        add_hypernews_mail_to_recipients(recipients, cadi_id)

    recid = record['_deposit']['pid']['value']

    subject = create_base_subject(config, cadi_id, recid)
    message = create_base_message(record, host_url, params)
    message += f"Submitted by {current_user.email}."

    return subject, message, recipients


GENERATE_RECIPIENT_METHODS = {
    "path_value_equals": path_value_equals,
    "get_cms_stat_recipients": get_cms_stat_recipients,
    "get_review_recipients": get_review_recipients,
}

NOTIFICATION_RECEPIENT = {
    "https://analysispreservation.cern.ch/schemas/deposits/"
    "records/cms-stats-questionnaire-v0.0.1.json": {
        "publish": {
            "type": "method",
            "method": "get_cms_stat_recipients",
            "path": "analysis_context.wg",
            "email_subject": "CMS Statistics Committee - "
        },
        "review": {
            "type": "method",
            "method": "get_review_recipients",
            "email_subject": "CMS Statistics Questionnaire - "
        }
    },
    "https://analysispreservation.cern.ch/schemas/deposits/"
    "records/cms-stats-questionnaire-v0.0.2.json": {
        "publish": {
            "type": "method",
            "method": "get_cms_stat_recipients",
            "path": "analysis_context.wg",
            "email_subject": "CMS Statistics Committee - "
        },
        "review": {
            "type": "method",
            "method": "get_review_recipients",
            "email_subject": "CMS Statistics Questionnaire - "
        }
    }
}


def generate_notification_attrs(record, host_url, config):
    _type = config.get("type")
    if _type == "method":
        func = GENERATE_RECIPIENT_METHODS.get(config.get("method"))
        if func:
            return func(record, host_url, config)
    elif _type == "list":
        return config.get("message", ""), config.get("data")
    else:
        return "", "", None


def send_mail_on_publish(recid, revision,
                         host_url='https://analysispreservation.cern.ch/',
                         recipients=None,
                         message='',
                         subject_prefix=''):
    if revision > 0:
        subject = subject_prefix + \
            "New Version of Published Analysis | CERN Analysis Preservation"
        template = "mail/analysis_published_revision.html"
    else:
        subject = subject_prefix + \
            "New Published Analysis | CERN Analysis Preservation"
        template = "mail/analysis_published_new.html"

    send_mail_on_hypernews(recipients, subject, message)
    send_mail_on_jira(recid, host_url, recipients, message, subject, template)

    create_and_send.delay(
        template,
        dict(recid=recid, url=host_url, message=message),
        subject,
        recipients
    )


def send_mail_on_review(analysis_url,
                        host_url='https://analysispreservation.cern.ch/',
                        recipients=None,
                        message='',
                        subject_prefix=''):
    subject = subject_prefix + \
        "New Review on Analysis | CERN Analysis Preservation"
    template = "mail/analysis_review.html"

    send_mail_on_hypernews(recipients, subject, message)

    create_and_send.delay(
        template,
        dict(analysis_url=analysis_url, url=host_url, message=message),
        subject,
        recipients
    )


def send_mail_on_hypernews(recipients, subject, message):
    # differentiate between hypernews mail and the others
    r = re.compile('hn-cms-.+')
    hypernews_list = [rec for rec in recipients if r.match(rec)]

    if hypernews_list:
        template = "mail/analysis_plain_text.html"
        recipients.remove(hypernews_list[0])

        create_and_send.delay(
            template,
            dict(message=message),
            subject,
            hypernews_list,
            type="plain"
        )


def send_mail_on_jira(recid, host_url, recipients, message, subject, template):
    # only JIRA ML mail
    conveners_ml_jira_mail = current_app.config.get("CONVENERS_ML_JIRA_MAIL")

    if conveners_ml_jira_mail in recipients:
        recipients.remove(conveners_ml_jira_mail)

        create_and_send.delay(
            template,
            dict(recid=recid, url=host_url, message=message),
            subject,
            [conveners_ml_jira_mail]
        )
