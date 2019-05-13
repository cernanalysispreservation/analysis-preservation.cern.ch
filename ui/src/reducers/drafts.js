import { Map } from "immutable";

import {
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_ERROR
} from "../actions/common";

import {
  TOGGLE_FILEMANAGER_LAYER,
  TOGGLE_PREVIEWER,
  TOGGLE_LIVE_VALIDATE,
  TOGGLE_CUSTOM_VALIDATION,
  TOGGLE_VALIDATE,
  TOGGLE_SIDEBAR,
  TOGGLE_ACTIONS_LAYER,
  DRAFTS_ITEM_REQUEST,
  DRAFTS_ITEM_SUCCESS,
  DRAFTS_ITEM_ERROR,
  BUCKET_ITEM_REQUEST,
  BUCKET_ITEM_SUCCESS,
  BUCKET_ITEM_ERROR,
  CREATE_DRAFT_REQUEST,
  CREATE_DRAFT_SUCCESS,
  CREATE_DRAFT_ERROR,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_ERROR,
  DELETE_FILE_REQUEST,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_ERROR,
  INIT_FORM,
  PUBLISH_DRAFT_REQUEST,
  PUBLISH_DRAFT_SUCCESS,
  PUBLISH_DRAFT_ERROR,
  DELETE_DRAFT_REQUEST,
  DELETE_DRAFT_SUCCESS,
  DELETE_DRAFT_ERROR,
  DISCARD_DRAFT_REQUEST,
  DISCARD_DRAFT_SUCCESS,
  DISCARD_DRAFT_ERROR,
  EDIT_PUBLISHED_REQUEST,
  EDIT_PUBLISHED_SUCCESS,
  EDIT_PUBLISHED_ERROR,
  UPDATE_DRAFT_REQUEST,
  UPDATE_DRAFT_SUCCESS,
  UPDATE_DRAFT_ERROR,
  PERMISSIONS_ITEM_REQUEST,
  PERMISSIONS_ITEM_SUCCESS,
  PERMISSIONS_ITEM_ERROR,
  CLEAR_ERROR_SUCCESS,
  FORM_DATA_CHANGE,
  GENERAL_TITLE_CHANGED,
  GENERAL_TITLE_REQUEST,
  GENERAL_TITLE_SUCCESS,
  GENERAL_TITLE_ERROR,
  UPLOAD_TO_ZENODO_REQUEST,
  UPLOAD_TO_ZENODO_SUCCESS,
  UPLOAD_TO_ZENODO_ERROR
} from "../actions/drafts";

const initialState = Map({
  schema: null,
  schemas: {},
  uiSchemas: {},
  uiSchema: null,
  schemaError: null,
  data: {},
  selectedSchema: null,
  fileManagerActiveLayer: false,
  fileManagerLayerSelectable: false,
  fileManagerLayerSelectableAction: null,
  actionsLayer: false,
  showPreviewer: false,
  showSidebar: true,
  liveValidate: true,
  validate: true,
  customValidation: false,
  current_item: Map({
    general_title: Map({
      title: "",
      error: null,
      loading: false
    }),
    schemas: null,
    schemasLoading: false,
    schema: null,
    id: null,
    published_id: null,
    data: null,
    formData: {},
    bucket_id: null,
    files: Map({}),
    loading: false,
    message: null,
    error: null,
    links: null,
    permissions: []
  }),
  zenodo: Map({})
});

export default function draftsReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FILEMANAGER_LAYER:
      return state
        .set("fileManagerActiveLayer", !state.get("fileManagerActiveLayer"))
        .set("fileManagerLayerSelectable", action.selectable)
        .set("fileManagerLayerSelectableAction", action.action);
    case TOGGLE_ACTIONS_LAYER:
      return state.set("actionsLayer", !state.get("actionsLayer"));
    case TOGGLE_PREVIEWER:
      return state.set("showPreviewer", !state.get("showPreviewer"));
    case TOGGLE_SIDEBAR:
      return state.set("showSidebar", !state.get("showSidebar"));
    case TOGGLE_LIVE_VALIDATE:
      return state.set("liveValidate", !state.get("liveValidate"));
    case TOGGLE_CUSTOM_VALIDATION:
      return state.set("customValidation", !state.get("customValidation"));
    case TOGGLE_VALIDATE:
      return state.set("validate", !state.get("validate"));
    case FETCH_SCHEMA_REQUEST:
      return state
        .setIn(["current_item", "schemasLoading"], true)
        .set("schemaError", null);
    case FETCH_SCHEMA_SUCCESS:
      return state
        .setIn(["current_item", "schemasLoading"], false)
        .setIn(["current_item", "schemas"], action.schema);
    case FETCH_SCHEMA_ERROR:
      return state
        .setIn(["current_item", "schemasLoading"], false)
        .set("schemaError", action.error.data);
    case DRAFTS_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], null)
        .setIn(["current_item", "error"], null);
    case DRAFTS_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "data"], action.draft.metadata)
        .setIn(
          ["current_item", "general_title", "title"],
          action.draft.metadata.general_title
        )
        .setIn(["current_item", "schema"], action.draft.metadata.$schema)
        .setIn(["current_item", "formData"], action.draft.metadata)
        .setIn(["current_item", "permissions"], action.permissions)
        .setIn(["current_item", "links"], Map(action.draft.links));
    case DRAFTS_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case BUCKET_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case BUCKET_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], null)
        .setIn(["current_item", "bucket_id"], action.bucket_id)
        .setIn(
          ["current_item", "files"],
          action.bucket.contents.length > 0
            ? Map(action.bucket.contents.map(item => [item.key, item]))
            : Map({})
        );
    case BUCKET_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case CREATE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], { msg: "Creating.." })
        .setIn(["current_item", "error"], null);
    case CREATE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "message"], { status: "ok", msg: "Created" })
        .setIn(["current_item", "error"], null)
        .setIn(["current_item", "id"], action.draft.id)
        .setIn(["current_item", "schema"], action.draft.metadata.$schema)
        .setIn(["current_item", "data"], action.draft.metadata)
        .setIn(
          ["current_item", "general_title", "title"],
          action.draft.metadata.general_title
        )
        .setIn(["current_item", "permissions"], action.draft.access)
        .setIn(["current_item", "formData"], action.draft.metadata)
        .setIn(["current_item", "links"], Map(action.draft.links));
    case CREATE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error)
        .setIn(["current_item", "message"], {
          status: "critical",
          msg: "Error while creating.."
        });
    case UPDATE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], { msg: "Updating.." });
    case UPDATE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "data"], action.draft.metadata)
        .setIn(["current_item", "formData"], action.draft.metadata)
        .setIn(["current_item", "message"], {
          status: "ok",
          msg: "All changes saved"
        });
    case UPDATE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error)
        .setIn(["current_item", "message"], {
          status: "critical",
          msg: "Error while updating.."
        });
    case INIT_FORM:
      return state
        .set(
          "current_item",
          Map({
            id: null,
            data: null,
            loading: false,
            error: null,
            links: null,
            files: Map({})
          })
        )
        .set(
          "zenodo",
          Map({
            loading: false,
            error: null,
            status: null
          })
        );
    case UPLOAD_FILE_REQUEST:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "uploading"
      });
    case UPLOAD_FILE_SUCCESS:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "done"
      });
    case UPLOAD_FILE_ERROR:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });
    case DELETE_FILE_REQUEST:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "deleting"
      });
    case DELETE_FILE_SUCCESS:
      return state.removeIn(["current_item", "files", action.filename]);
    case DELETE_FILE_ERROR:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });
    case PUBLISH_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case PUBLISH_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "published_id"], action.published_id)
        .setIn(["current_item", "data"], action.published_record);
    case PUBLISH_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case DELETE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case DELETE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "id"], null)
        .setIn(["current_item", "data"], null);
    case DELETE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case DISCARD_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case DISCARD_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "published_id"], null)
        .setIn(["current_item", "data"], action.data)
        .setIn(["current_item", "formData"], action.data);
    case DISCARD_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case EDIT_PUBLISHED_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case EDIT_PUBLISHED_SUCCESS:
      return state
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "published_id"], null)
        .setIn(["current_item", "data"], action.draft);
    case EDIT_PUBLISHED_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case PERMISSIONS_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case PERMISSIONS_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "permissions"], action.permissions)
        .setIn(["current_item", "loading"], false);
    case PERMISSIONS_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error.response.data);
    case CLEAR_ERROR_SUCCESS:
      return state.setIn(["current_item", "error"], null);
    case UPLOAD_TO_ZENODO_REQUEST:
      return state
        .setIn(["zenodo", "loading"], true)
        .setIn(["zenodo", "error"], false);
    case UPLOAD_TO_ZENODO_SUCCESS:
      return state.setIn(
        ["zenodo", action.element_id, "status"],
        action.status
      );
    case UPLOAD_TO_ZENODO_ERROR:
      return state
        .setIn(["zenodo", "loading"], false)
        .setIn(["zenodo", "error"], action.error);
    case FORM_DATA_CHANGE:
      return state.setIn(["current_item", "formData"], action.data);
    case GENERAL_TITLE_CHANGED:
      return state.setIn(
        ["current_item", "general_title", "title"],
        action.title
      );
    case GENERAL_TITLE_REQUEST:
      return state
        .setIn(["current_item", "general_title", "loading"], true)
        .setIn(["current_item", "general_title", "error"], null);
    case GENERAL_TITLE_SUCCESS:
      return state
        .setIn(["current_item", "general_title", "loading"], false)
        .setIn(["current_item", "general_title", "title"], action.title);
    case GENERAL_TITLE_ERROR:
      return state
        .setIn(["current_item", "general_title", "loading"], false)
        .setIn(["current_item", "general_title", "error"], action.error);
    default:
      return state;
  }
}
