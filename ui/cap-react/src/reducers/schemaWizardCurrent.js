import { Map, fromJS } from "immutable";
import undoable, { includeAction } from "redux-undo";
import {
  CURRENT_UPDATE_PATH,
  CURRENT_UPDATE_SCHEMA_PATH,
  CURRENT_UPDATE_UI_SCHEMA_PATH,
  SCHEMA_INIT,
  ADD_PROPERTY
} from "../actions/schemaWizard";

const initialState = Map({
  current: fromJS({
    schema: {},
    uiSchema: {}
  })
});

function schemaWizardCurrentReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMA_INIT:
      return state.set("current", fromJS(action.data));
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
    case ADD_PROPERTY:
      return state.setIn(
        ["current", "schema", ...action.path, "properties", action.key],
        fromJS({})
      );
    default:
      return state;
  }
}

const undoableSchema = undoable(schemaWizardCurrentReducer, {
  filter: includeAction([
    SCHEMA_INIT,
    CURRENT_UPDATE_PATH,
    CURRENT_UPDATE_SCHEMA_PATH
    // CURRENT_UPDATE_UI_SCHEMA_PATH
  ])
});

export default undoableSchema;
