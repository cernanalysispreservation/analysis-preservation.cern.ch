import { Map, fromJS } from "immutable";

import {
  SCHEMA_INIT,
  CURRENT_UPDATE_CONFIG,
  PROPERTY_SELECT,
  CREATE_MODE_ENABLE,
  ADD_PROPERTY,
  ADD_PROPERTY_INIT,
  SCHEMA_ERROR,
  SCHEMA_INIT_REQUEST
} from "../actions/schemaWizard";

const initialState = Map({
  initial: fromJS({
    schema: {},
    uiSchema: {}
  }),
  config: {},
  field: null,
  propKeyEditor: null,
  error: null,
  loader: false
});

export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMA_INIT_REQUEST:
      return initialState.set("loader", true);
    case SCHEMA_INIT:
      return state
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
      return state.set("propKeyEditor", null);
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
    case CURRENT_UPDATE_CONFIG:
      return state.set("config", action.config);
    default:
      return state;
  }
}
