import { Map, Set, OrderedSet, fromJS } from "immutable";

import * as commonActions from "../actions/common"; // Common Actions
import * as draftItemActions from "../actions/draftItem"; // Drafts Actions
import * as filesActions from "../actions/files"; // Files Actions
import * as workflowsActions from "../actions/workflows"; // Workflows Actions

const initialState = Map({
  errors: [],
  schemaErrors: [],
  activeTab: 0,
  tabs: OrderedSet([]),
  formErrors: Set([]),
  actionsLayer: false,
  actionsLayerType: null,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},
  uploadFiles: Map({}),
  pathSelected: null,

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({}),
  formData: null,
  // From backend: deposit resource
  access: null,
  can_admin: false,
  can_update: false,
  created: null,
  loading: false,
  created_by: null,
  experiment: null,
  files: Map({}),
  id: null,
  links: null,
  metadata: {},
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null
});

export default function draftsReducer(state = initialState, action) {
  switch (action.type) {
    case draftItemActions.REMOVE_LOADING:
      return state.set("loading", false);
    case draftItemActions.TOGGLE_ACTIONS_LAYER:
      return state
        .set("actionsLayer", !state.get("actionsLayer"))
        .set("actionsLayerType", action.actionType);
    case draftItemActions.TOGGLE_PREVIEWER:
      return state.set("showPreviewer", !state.get("showPreviewer"));
    case draftItemActions.TOGGLE_FILE_PREVIEW_EDIT:
      return state
        .set("filePreviewEditLayer", !state.get("filePreviewEditLayer"))
        .set("filePreviewEdit", action.payload);
    case draftItemActions.INIT_FORM:
      return initialState;
    case draftItemActions.CLEAR_ERROR_SUCCESS:
      return state.set("errors", []);
    case draftItemActions.DRAFTS_ITEM_TABS: {
      let _tabs = state.get("tabs").add(action.tab);
      let active_tab = _tabs.toJS().indexOf(action.tab);
      return state
        .set("tabs", _tabs)
        .set("activeTab", active_tab > -1 ? active_tab : 0);
    }
    case draftItemActions.DRAFTS_ITEM_TABS_CLOSE: {
      let _tabs = state.get("tabs");
      let closing_tab = _tabs.toJS()[action.tab];
      _tabs = _tabs.delete(closing_tab);
      return state
        .set("tabs", _tabs)
        .set(
          "activeTab",
          state.get("activeTab") == closing_tab
            ? state.get("activeTab") - 1
            : state.get("activeTab")
        );
    }
    case draftItemActions.DRAFTS_ITEM_TABS_ACTIVE_INDEX: {
      let _tabs = state.get("tabs");
      let active_tab = _tabs.toJS().indexOf(action.tab);
      let _tabs_size = state.get("tabs").size;
      return state.set("activeTab", action.tab);
    }
    case commonActions.FORM_ERRORS:
      return state.set("formErrors", Set(action.errors));
    case commonActions.FETCH_SCHEMA_ERROR:
      return state.set("schemaErrors", [
        ...state.get("schemaErrors"),
        action.error
      ]);
    case commonActions.FETCH_SCHEMA_SUCCESS: {
      let { schemaId, ...schemas } = action.schema;
      return state.set("schema", schemaId).set("schemas", schemas);
    }
    case draftItemActions.FORM_DATA_CHANGE:
      return state.set("formData", action.data);
    case draftItemActions.TOGGLE_FILEMANAGER_LAYER:
      return state
        .set(
          "uploadFiles",
          state.get("uploadFiles").filter(x => x.progress != 1)
        )
        .set("fileManagerActiveLayer", !state.get("fileManagerActiveLayer"))
        .set("fileManagerLayerSelectable", action.selectable)
        .set("fileManagerLayerSelectableAction", action.action)
        .set("fileManagerLayerActiveIndex", action.active)
        .set("pathSelected", null);
    // Draft Metadata
    case draftItemActions.DRAFTS_ITEM_REQUEST:
      return initialState.set("loading", true);
    case draftItemActions.DRAFTS_ITEM_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.DRAFTS_ITEM_ERROR:
      return state.set("errors", action.error);
    case draftItemActions.CREATE_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.CREATE_DRAFT_SUCCESS:
      return initialState
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.CREATE_DRAFT_ERROR:
      return state
        .set("loading", false)
        .set("errors", [...state.get("errors"), action.error]);

    case draftItemActions.UPDATE_DRAFT_REQUEST:
      return state.set("loading", true);
    // .setIn(["current_item", "message"], { msg: "Updating.." });
    case draftItemActions.UPDATE_DRAFT_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .set("loading", false)
        .set("message", {
          status: "ok",
          msg: "All changes saved"
        })
        .merge(Map(action.draft));
    case draftItemActions.UPDATE_DRAFT_ERROR:
      return state
        .set("loading", false)
        .set("errors", [...state.get("errors"), action.error])
        .set("message", {
          status: "critical",
          msg: "Error while updating.."
        });

    case draftItemActions.DELETE_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.DELETE_DRAFT_SUCCESS:
      return initialState;
    case draftItemActions.DELETE_DRAFT_ERROR:
      return state
        .set("loading", false)
        .set("errors", [...state.get("errors"), action.error]);

    case draftItemActions.DISCARD_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.DISCARD_DRAFT_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    // case draftItemActions.DISCARD_DRAFT_ERROR:
    // 	return state
    // 		.set("loading", false)
    // 		.set("error", action.error);
    case draftItemActions.EDIT_PUBLISHED_REQUEST:
      return state.set("loading", true);
    // .set("error", null);
    case draftItemActions.EDIT_PUBLISHED_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    // case draftItemActions.EDIT_PUBLISHED_ERROR:
    // 	return state
    // 		.set("loading", false)
    // 		.set("error", action.error);
    case draftItemActions.PUBLISH_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.PUBLISH_DRAFT_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.PUBLISH_DRAFT_ERROR:
      return state.set("loading", false);

    case draftItemActions.GENERAL_TITLE_REQUEST:
      return state.set("generalTitleLoading", true);
    case draftItemActions.GENERAL_TITLE_SUCCESS:
      return state.merge(Map(action.draft)).set("generalTitleLoading", false);

    case draftItemActions.GENERAL_TITLE_ERROR:
      return state.set("generalTitleLoading", false);

    // Access
    case draftItemActions.PERMISSIONS_ITEM_REQUEST:
      return state.set("loading", true);
    case draftItemActions.PERMISSIONS_ITEM_SUCCESS:
      return state.set("access", action.permissions).set("loading", false);

    // Files
    case filesActions.BUCKET_ITEM_REQUEST:
      return state.set("loading", true);
    case filesActions.BUCKET_ITEM_SUCCESS:
      return state
        .set("loading", false)
        .set(
          "bucket",
          action.bucket.contents.length > 0
            ? Map(action.bucket.contents.map(item => [item.key, item]))
            : Map({})
        );
    case filesActions.BUCKET_ITEM_ERROR:
      return state
        .set("loading", false)
        .set("error", [...state.get("errors"), action.error]);
    case filesActions.PATH_SELECTED:
      return state.set("pathSelected", {
        type: action.path_type,
        path: action.path
      });
    case filesActions.UPLOAD_FILE_REQUEST:
      return state.setIn(["uploadFiles", action.filename], {
        key: action.filename,
        status: "uploading",
        progress: 0
      });
    case filesActions.UPLOAD_FILE_PROGRESS:
      return state.setIn(["uploadFiles", action.filename], {
        key: action.filename,
        status: "uploading",
        progress: action.progress
      });
    case filesActions.UPLOAD_FILE_SUCCESS:
      return state
        .setIn(["uploadFiles", action.filename], {
          key: action.filename,
          status: "done",
          progress: 1,
          mimetype: action.data.mimetype,
          data: action.data
        })
        .setIn(["bucket", action.filename], { ...action.data, status: "done" });
    case filesActions.UPLOAD_ACTION_SUCCESS:
      return state.setIn(["uploadFiles", action.filename], {
        key: action.filename,
        status: "fetching"
      });
    case filesActions.UPLOAD_FILE_ERROR:
      return state.setIn(["uploadFiles", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });
    case filesActions.DELETE_FILE_REQUEST:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "deleting"
      });
    case filesActions.DELETE_FILE_SUCCESS:
      return state.removeIn(["bucket", action.filename]);
    case filesActions.DELETE_FILE_ERROR:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });

    // Draft workflows
    case workflowsActions.WORKFLOWS_RECORD_SUCCESS:
      return state.set("workflows", fromJS(action.workflows));
    case workflowsActions.RECORD_WORKFLOW_SUCCESS:
      return state
        .mergeIn(["workflows_items", action.workflow_id], action.data)
        .setIn(["workflows_items", action.workflow_id, "loading"], false);
    case workflowsActions.WORKFLOW_FILES_SUCCESS:
      return state.setIn(
        ["workflows_items", action.workflow_id, "files"],
        action.data.files
      );
    default:
      return state;
  }
}
