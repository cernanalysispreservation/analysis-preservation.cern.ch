# JSON and JSON Schema

The analysis information is modelled in JSON to ensure data is added in the structure and formatting predefined by the CERN Analysis Preservation team and each collaboration. JSON is an open data format where data is represented as objects of key-value pairs. It is independent from any tools and programming languages, usually stored in `.json` text files and can be parsed and created to and from most programming languages and systems. Therefore it is an easy format to share and preserve data.

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

An example schema against which the above JSON file is validated:

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

The schema defines the structure and data types JSON data needs to follow and use to be valid against the schema, and it allows adding additional rules like required fields.

Each schema is directly provided or created with the support of collaboration physicists and tested, as well as revised, several times to ensure that important information will be preserved. Throughout this process, core components of an analysis are identified and structured. Each collaboration has its own unique schema to capture the workflow that fits their specific requirements.

Every schema change is versioned so that it can adapt to changes in the data or other components provided by the collaborations. This practice also ensures the that the integrity of the older analysis records is maintained.

Depending on the preference and work environment of the researcher, analysis information can be created and edited through a [submission form](./tutorials.md#the-cap-form) on the web interface or via the [API](./api.md).
