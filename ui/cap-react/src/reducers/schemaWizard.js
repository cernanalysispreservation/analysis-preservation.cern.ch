import { Map, fromJS } from "immutable";

import {
  SCHEMA_INIT,
  CURRENT_UPDATE_CONFIG,
  CURRENT_UPDATE_PATH,
  CURRENT_UPDATE_SCHEMA_PATH,
  CURRENT_UPDATE_UI_SCHEMA_PATH,
  PROPERTY_SELECT,
  CREATE_MODE_ENABLE,
  ADD_PROPERTY,
  ADD_PROPERTY_INIT,
  SCHEMA_ERROR,
  SCHEMA_INIT_REQUEST,
  SCHEMA_CONFIG_UPDATE
} from "../actions/schemaWizard";

const initialState = Map({
  current: fromJS({
    schema: {},
    uiSchema: {}
  }),
  initial: fromJS({
    schema: {},
    uiSchema: {}
  }),
  config: {},
  field: null,
  propKeyEditor: null,
  error: null,
  loader: false,
  schemaConfig: Map({
    reviewable: true,
    notifications: {
      actions: {
        publish: [
          {
            op: "and",
            checks: [
              {
                path: "ml_app_use",
                if: "exists",
                value: "True"
              },
              {
                op: "or",
                checks: [
                  {
                    path: "first",
                    if: "exists",
                    value: "True"
                  },
                  {
                    path: "second",
                    if: "exists",
                    value: "True"
                  }
                ]
              }
            ],
            mails: {
              default: {
                cc: [
                  "ml-conveners-test@cern0.ch",
                  "ml-conveners-jira-test@cern0.ch"
                ],
                bcc: ["something-else@cern0.ch"],
                to: ["atlas@cern.ch"]
              }
            }
          }
        ],
        review: [
          {
            op: "and",
            checks: [
              {
                path: "ml_app_use",
                if: "exists",
                value: "True"
              }
            ],
            mails: {
              default: {
                bcc: ["something-else@cern0.ch"],
                to: ["atlas@cern.ch"]
              }
            }
          }
        ]
      }
    }
  })
});

export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMA_INIT_REQUEST:
      return initialState.set("loader", true);
    case SCHEMA_INIT:
      return state
        .set("current", fromJS(action.data))
        .set("initial", fromJS(action.data))
        .set("config", action.configs)
        .set("loader", false);
    case SCHEMA_ERROR:
      return state.set("error", action.payload).set("loader", false);

    case ADD_PROPERTY_INIT:
      return state.set(
        "propKeyEditor",
        Map({ path: action.path, type: "new" })
      );
    case ADD_PROPERTY:
      return state
        .setIn(
          ["current", "schema", ...action.path, "properties", action.key],
          fromJS({})
        )
        .set("propKeyEditor", null);
    case PROPERTY_SELECT:
      return state.set(
        "field",
        fromJS({
          path: action.path.schema,
          uiPath: action.path.uiSchema
        })
      );
    case CREATE_MODE_ENABLE:
      return state.set("field", null);
    case CURRENT_UPDATE_PATH:
      return state
        .setIn(
          ["current", "uiSchema", ...action.path.uiSchema],
          fromJS(action.value.uiSchema)
        )
        .setIn(
          ["current", "schema", ...action.path.schema],
          fromJS(action.value.schema)
        );
    case CURRENT_UPDATE_SCHEMA_PATH:
      return state.setIn(
        ["current", "schema", ...action.path],
        fromJS(action.value)
      );
    case CURRENT_UPDATE_UI_SCHEMA_PATH:
      return state.setIn(
        ["current", "uiSchema", ...action.path],
        fromJS(action.value)
      );
    case CURRENT_UPDATE_CONFIG:
      return state.set("config", action.config);
    case SCHEMA_CONFIG_UPDATE:
      return state.set("schemaConfig", fromJS(action.payload));
    default:
      return state;
  }
}
