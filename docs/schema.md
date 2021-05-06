# JSON and JSON Schema

The analysis information is modelled in JSON to ensure data is added in the structure and formatting predefined by the CERN Analysis Preservation team in and the physicists from the LHC collaborations. JSON is an open data format where data is represented as objects of key-value pairs. It is independent from any tools and programming languages, usually stored in .json text files and can be parsed and created to and from most programming languages and systems. Therefore it is an easy format to share and preserve data.

An example miniature JSON file::

    {
      "basic_info": {
        "analysis_name": "Z -> ee",
        "status": "0 - planned / open topic",
        "people_info": [
          {
            "name": "John Doe",
            "email": "john.doe@cern.ch"
          },
          {
            "name": "Jane Doe",
            "email": "jane.doe@cern.ch"
          }
        ]
      }
    }

The above definitions contain a name, status and an array of names and emails. Every `{...}` marks an object, `[...]` marks an array and strings are wrapped in `"..."`. Other possible data types are numbers (e.g. `1`, `0.5`), booleans (`true`, `false`) and `null` for an empty value.

A JSON schema defines a structure and rules that apply to it. JSON data can be validated against a schema to check whether the data fits the pre-defined structure and requirements of the schema.

An example schema against which the above JSON file is validated::

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "Internal Title (not displayed)",
      "description": "Internal Description (not displayed)",
      "type": "object",
      "properties": {
        "basic_info": {
          "title": "Basic Information",
          "description": "Please provide meta-data information relevant for the analysis here.",
          "type": "object",
          "properties": {
            "analysis_name": {
              "title": "Analysis Name",
              "type": "string",
              "required": true
            },
            "status": {
            "title": "Status",
            "type": "string",
              "enum": [
                "0 - planned / open topic",
                "1 - in preparation",
                "2 - ANA note released",
                "3 - review committee",
                "4 - collaboration review",
                "5 -",
                "6 - CONF note published",
                "7 -",
                "8 - journal review",
                "9 - PAPER published",
                "x - other"
              ]
            },
            "people_info": {
              "title": "Proponents",
              "description": "Please provide information about the people involved in the analysis.",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "title": "Name",
                    "type": "string"
                  },
                  "email": {
                    "title": "Email-Adress",
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    }

The schema defines the structure and data types JSON data needs to follow and use to validate against it and allows to add additional rules like required fields.

Each schema is directly provided or created with the support of collaboration physicists and tested, as well as revised, several times to ensure that important information will be preserved. Throughout this process, core components of an analysis are identified and structured. Each collaboration has its own unique schema to capture the workflow that fits their specific requirements.

Every schema change is versioned so that it can adapt to changes in the data or other components provided by the collaborations. This practice also ensures the that the integrity of the older analysis records is maintained.

Depending on the preference and work environment of the researcher, analysis information can be created and edited through a [project-submission-form](./tutorials.md#the-cap-form) on the web interface or via the [project-rest-api](./api.md).


# Schema Configuration

The new versions of CAP schemas support hardcoded configuration options, which can be used either to perform certain tasks,
or certain checks. Right now the supported options are:

- `reviewable`: shows if the analysis type is reviewable (used to add review options in the UI)
- `notifications`: an extended JSON that provides a lot of options regarding notifications/mails

As the `notifications` is the most complicated of the two, we will explain its components in depth, and how they should be used.


### Notification Config Structure

The basic structure that is followed is this:

    "config": {
        "notifications": {
          "actions": {
            "publish": {...},
            "review": {...}
          }
        }
      }

What this means essentially is that when certain actions are triggered on a deposit, in this case when it is `published` or
`reviewed`, the backend will handle the mail/notifications according to what is configured. The fields in each one of those
actions represent a part of the required context of the mail:

- `subject`
- `message`
- `recipients`
- `template`

Let's provide some examples for each one, and explain their usage.


##### 1. Subject

This field provides configuration regarding the `subject` of the mail. It looks like this:

    "subject": {
      "template": "Subject with {{ title }} and id {{ published_id }}",
      "ctx": [{
        "name": "title",
        "type": "path",
        "path": "general_title"
      }, {
        "type": "method",
        "method": "published_id"
      }]
    }

The user needs to provide a path to a `template` or `template_file`, that will be populated by the context (`ctx`).
The context variables can be accessed in 2 different ways by their `type`:

- `path` uses the deposit path that holds a variable
- `method` uses a custom method that can be created and accessed in the `cap.modules.mail.custom.subject.py` file

The subject `template_file` should be added in the `cap.modules.mail.templates.mail.subject` folder.
The template can be omitted since there are defaults that can be used for each action.


##### 2. Message

Similar to the subject, we provide a template and a context for the message of tha notification, as follows:

    "message": {
      "template_file": "mail/message/questionnaire_message_published.html",
      "ctx": [{
        "name": "title",
        "type": "path",
        "path": "general_title"
      }, {
        "type": "method",
        "method": "submitter_mail"
      }]
    }

The same rules are being followed, with the exception that if no message is provided, then the notification will only
contain a header with general information, and no specific info. The template file should be added in the 
`cap.modules.mail.templates.mail.message` folder, and the custom functions in the `cap.modules.mail.custom.message.py` file


##### 3. Recipients

Due to the complicated nature and requirements in adding recipients, the configuration follows more steps. Let's take a
look at an example:

    "recipients": {
      "bcc": [
        {
          "type": "method",
          "method": "get_owner"
        }, {
          "type": "default",
          "mails": {
            "default": ["some-recipient-placeholder@cern.ch"],
            "formatted": [{
              "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",
              "ctx": [{
                "name": "cadi_id",
                "type": "path",
                "path": "analysis_context.cadi_id"
              }]
            }]
          }
        }, {
          "type": "condition",
          "checks": [{
            "path": "parton_distribution_functions",
            "if": "exists",
            "value": true
          }],
          "mails": {
            "default": ["pdf-forum-placeholder@cern.ch"]
          }
        }
      ]
    }

The `recipients` field differentiates 3 categories:
- `recipients`
- `cc`
- `bcc`

All 3 can be used to send a mail, and have their own mails and rules about how they will be added. The rules are in 3 categories:

- `default`: the mails in the list will be added
- `method`: a method that returns a list of mail (for complicated options)
- `conditions`: mails will be added if a certain condition is true


Regarding the conditions, each one of them has a collection of checks that need to pass, in order for the mails to be added
in the recipients list. Each condition object contains:

- `op`: the operation to be done in the check results. If `and`, all the checks need to be true, and if `or`, just one of them is enough
- `mails`: the mails that will be added
- `checks`: a list of checks

Each `check` object needs to have:

- `path`: the path of variable, found in the deposit
- `value`: the value that needs to be the result of the method used
- `if`: the method that will be used

If for example you need to make sure that the deposit has a `general_title`, then the check would be

    {
      "path": "general_title",
      "if": "exists",
      "value": true
    }

if you need to make sure that a certain value does not appear in a list, then

    {
      "path": "path.to.some_list",
      "if": "is_not_in",
      "value": "some value'
    }

The supported conditions and checks can be found in the `cap.modules.mail.conditions.py` file


##### 4. Template

This field provides the general template that will be followed for the specific notification, similar with the above fields.