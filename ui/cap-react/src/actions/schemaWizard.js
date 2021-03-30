import axios from "axios";
import { push } from "connected-react-router";
import cogoToast from "cogo-toast";
import { slugify, _initSchemaStructure } from "../components/cms/utils";

export const ADD_PROPERTY = "ADD_PROPERTY";
export const ADD_PROPERTY_INIT = "ADD_PROPERTY_INIT";

export const CREATE_MODE_ENABLE = "CREATE_MODE_ENABLE";

export const PROPERTY_SELECT = "PROPERTY_SELECT";

export const SCHEMA_INIT_REQUEST = "SCHEMA_INIT_REQUEST";
export const SCHEMA_INIT = "SCHEMA_INIT";
export const SCHEMA_ERROR = "SCHEMA_ERROR";

export const CURRENT_UPDATE_CONFIG = "CURRENT_UPDATE_CONFIG";
export const CURRENT_UPDATE_PATH = "CURRENT_UPDATE_PATH";
export const CURRENT_UPDATE_SCHEMA_PATH = "CURRENT_UPDATE_SCHEMA_PATH";
export const CURRENT_UPDATE_UI_SCHEMA_PATH = "CURRENT_UPDATE_UI_SCHEMA_PATH";
import { fromJS } from "immutable";

export function schemaError(error) {
  return {
    type: SCHEMA_ERROR,
    payload: error
  };
}

export function schemaInitRequest() {
  return {
    type: SCHEMA_INIT_REQUEST
  };
}

export function schemaInit(id, data, configs = {}) {
  return {
    type: SCHEMA_INIT,
    id,
    data,
    configs
  };
}

export function enableCreateMode() {
  return { type: CREATE_MODE_ENABLE };
}

export function selectProperty(path) {
  return {
    type: PROPERTY_SELECT,
    path
  };
}

export function initSchemaWizard(data) {
  return function(dispatch) {
    const { id, deposit_schema, deposit_options, ...configs } = data;

    dispatch(
      schemaInit(
        id || "Schema Name",
        { schema: deposit_schema, uiSchema: deposit_options },
        configs
      )
    );
    dispatch(push("/cms/edit"));
  };
}

export function getSchema(name, version = null) {
  let schemaLink;

  if (version) schemaLink = `/api/jsonschemas/${name}/${version}?resolve=1`;
  else schemaLink = `/api/jsonschemas/${name}?resolve=1`;
  return function(dispatch) {
    dispatch(schemaInitRequest());
    axios
      .get(schemaLink)
      .then(resp => {
        let schema = resp.data;
        let { id, deposit_schema, deposit_options, ...configs } = schema;
        if (deposit_schema && deposit_options)
          dispatch(
            schemaInit(
              id || "Schema Name",
              { schema: deposit_schema, uiSchema: deposit_options },
              configs
            )
          );
      })
      .catch(err => {
        dispatch(schemaError(err));
      });
  };
}

export function getSchemasLocalStorage() {
  return function() {
    //let availableSchemas = localStorage.getItem("availableSchemas");
    let availableSchemas = JSON.parse(availableSchemas);
  };
}

export function createContentType(content_type) {
  return function(dispatch) {
    dispatch(schemaInitRequest());
    let name = content_type.formData.name;
    let description = content_type.formData.description;
    const _id = slugify(Math.random().toString() + "_" + name);

    dispatch(
      schemaInit(_id, _initSchemaStructure(name, description), {
        fullname: name
      })
    );
    dispatch(push("/cms/edit"));
  };
}

export function selectContentType(id) {
  return function(dispatch) {
    dispatch(getSchema(id));
    dispatch(push(`/cms/edit`));
  };
}

export function selectFieldType(path, change) {
  return function(dispatch) {
    dispatch(updateByPath(path, change));
  };
}
export function updateCurrentSchemaWithField(schema) {
  return function(dispatch, getState) {
    let state = getState().schemaWizard;
    let propKey = state.getIn(["field", "propKey"]);
    let path = state.getIn(["field", "path"]).toJS();

    const pathToChange = propKey ? [...path, propKey] : path;
    dispatch(updateSchemaByPath(pathToChange, schema));
  };
}

export function updateSchemaConfig(config) {
  return {
    type: CURRENT_UPDATE_CONFIG,
    config
  };
}

export function updateSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_SCHEMA_PATH,
    path,
    value
  };
}

export function updateUiSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_UI_SCHEMA_PATH,
    path,
    value
  };
}

export function updateByPath(path, value) {
  return {
    type: CURRENT_UPDATE_PATH,
    path,
    value
  };
}

export function addByPath({ schema: path, uiSchema: uiPath }, data) {
  return function(dispatch, getState) {
    let schema = getState().schemaWizard.getIn(["current", "schema", ...path]);

    let _path = path;
    let _uiPath = uiPath;

    let random_name = `item_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    if (schema.has("type")) {
      if (schema.get("type") === "object") {
        if (!schema.has("properties")) {
          schema = schema.set("properties", {});
        }
        _path = [...path, "properties", random_name];
        _uiPath = [...uiPath, random_name];
      } else if (schema.get("type") === "array") {
        if (!schema.has("items")) {
          schema = schema.set("items", {});
        }
        _path = [...path, "items"];
        _uiPath = [...uiPath, "items"];
      }

      dispatch(
        updateByPath(
          { schema: _path, uiSchema: _uiPath },
          {
            schema: fromJS(data.schema),
            uiSchema: fromJS(data.uiSchema)
          }
        )
      );
    }
  };
}

export function initAddProperty(path) {
  return {
    type: ADD_PROPERTY_INIT,
    path
  };
}

export function addProperty(path, key) {
  return {
    type: ADD_PROPERTY,
    path,
    key
  };
}

// delete item from schema and uiSchema
export function deleteByPath(ourPath) {
  return function(dispatch, getState) {
    let path = ourPath.getIn(["path"]);
    let uiPath = ourPath.getIn(["uiPath"]);

    // ********* schema **********
    let itemToDelete = path.last();

    path = path.pop();

    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    if (itemToDelete === "items") {
      itemToDelete = path.last();
      path = path.pop();
    }

    let schemaPath = path.valueSeq().toArray();

    let schema = getState().schemaWizard.getIn([
      "current",
      "schema",
      ...schemaPath
    ]);

    schema = schema.delete(itemToDelete);

    // ********* uiSchema **********

    let uiItemToDelete = uiPath.last();
    uiPath = uiPath.pop();

    let schemaUIPath = uiPath.valueSeq().toArray();

    let uiSchema = getState().schemaWizard.getIn([
      "current",
      "uiSchema",
      ...schemaUIPath
    ]);

    uiSchema = uiSchema.delete(uiItemToDelete);
    if (uiSchema.get("ui:order") && uiSchema.get("ui:order").size > 0) {
      let newUiOrder = uiSchema
        .get("ui:order")
        .filter(item => item !== uiItemToDelete);
      uiSchema = uiSchema.set("ui:order", newUiOrder);
    }

    // ********* update changes **********
    dispatch(
      updateByPath(
        { schema: schemaPath, uiSchema: schemaUIPath },
        { schema, uiSchema }
      )
    );
    dispatch(enableCreateMode());
  };
}

// update the id field of a property
export function renameIdByPath(newName, pathToItem) {
  return function(dispatch, getState) {
    let path = pathToItem.get("path");

    let itemToDelete = path.last();
    path = path.pop();

    if (itemToDelete === "items") {
      itemToDelete = path.last();
      path = path.pop();
    }

    let schemaPath = path.valueSeq().toArray();

    let uiPath = pathToItem.get("uiPath");
    const uiItemToDelete = uiPath.last();
    uiPath = uiPath.pop();

    let schemaUIPath = uiPath.valueSeq().toArray();

    // check if the new id is empty or exact same with the current id
    if (newName === itemToDelete || newName === "") {
      cogoToast.warn("Make sure that the new id is different and not empty", {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      });
      return;
    }

    // navigate to the correct path
    let schema = getState().schemaWizard.getIn([
      "current",
      "schema",
      ...schemaPath
    ]);

    let uiSchema = getState().schemaWizard.getIn([
      "current",
      "uiSchema",
      ...schemaUIPath
    ]);

    // ********* schema **********

    // make sure that the new name is unique among sibling widgets
    if (schema.has(newName)) {
      cogoToast.error("The id should be unique, this name already exists", {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      });
      return;
    }

    schema = schema.set(newName, schema.get(itemToDelete));
    schema = schema.delete(itemToDelete);

    // ********* uiSchema **********
    if (!uiSchema.has("ui:order")) {
      uiSchema = uiSchema.set("ui:order", []);
    }

    // update the uiOrder array
    if (uiSchema.get("ui:order").includes(uiItemToDelete)) {
      let valueIndex = uiSchema.get("ui:order").indexOf(uiItemToDelete);
      let newUiOrder = uiSchema.get("ui:order").set(valueIndex, newName);
      uiSchema = uiSchema.set("ui:order", newUiOrder);
    }

    if (uiSchema.includes(uiItemToDelete)) {
      let val = uiSchema.get(uiItemToDelete);
      uiSchema = uiSchema.set(newName, val);
      uiSchema = uiSchema.delete(uiItemToDelete);
    }

    // ********* update changes **********
    dispatch(
      updateByPath(
        { schema: schemaPath, uiSchema: schemaUIPath },
        { schema: schema, uiSchema: uiSchema }
      )
    );

    dispatch(
      selectProperty({
        schema: [...schemaPath, newName],
        uiSchema: [...schemaUIPath, newName]
      })
    );
  };
}

export function updateSchemaProps(prop) {
  return function(dispatch, getState) {
    const { title, description, configs } = prop;

    let schema = getState()
      .schemaWizard.getIn(["current", "schema"])
      .toJS();

    if (configs) {
      dispatch(updateSchemaConfig(configs));
      return;
    }

    if (title) {
      schema.title = title;
    }

    if (description) {
      schema.description = description;
    }

    dispatch(updateSchemaByPath([], schema));
  };
}
