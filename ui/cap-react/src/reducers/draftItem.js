import { Map, Set, fromJS } from "immutable";

import * as commonActions from "../actions/common"; // Common Actions
import * as draftItemActions from "../actions/draftItem"; // Drafts Actions
import * as filesActions from "../actions/files"; // Files Actions
import * as workflowsActions from "../actions/workflows"; // Workflows Actions

const initialState = Map({
  errors: [],
  extraErrors: {},
  schemaErrors: [],
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
  updated: null,
  fileVersions: fromJS([])
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
    case draftItemActions.CLEAR_ERRORS:
      return state
        .set("errors", [])
        .set("formErrors", Set([]))
        .set("extraErrors", {});
    case commonActions.FORM_ERRORS:
      return state.set(
        "formErrors",
        state.get("formErrors").union(action.errors)
      );
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
        .set("loading", false)
        .merge(Map(action.draft));
    case draftItemActions.DRAFTS_ITEM_ERROR:
      return state.set("errors", action.error).set("loading", false);
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
      return state
        .set("loading", true)
        .set("errors", [])
        .set("formErrors", Set([]))
        .set("extraErrors", {});
    // .setIn(["current_item", "message"], { msg: "Updating.." });
    case draftItemActions.UPDATE_DRAFT_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .set("loading", false)
        .set("formErrors", Set([]))
        .set("extraErrors", {})
        .set("message", {
          status: "ok",
          msg: "All changes saved"
        })
        .merge(Map(action.draft));
    case draftItemActions.UPDATE_DRAFT_ERROR:
      return state.set("extraErrors", action.error).set("loading", false);
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
    case draftItemActions.REVIEW_DRAFT_SUCCESS:
      return state.set("review", action.draft.review).set("loading", false);
    case draftItemActions.REVIEW_DRAFT_ERROR:
      return state.set("reviewError", action.error).set("loading", false);
    case draftItemActions.REVIEW_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.EDIT_PUBLISHED_REQUEST:
      return state.set("loading", true);
    // .set("error", null);
    case draftItemActions.EDIT_PUBLISHED_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map({ ...action.draft }));

    // case draftItemActions.EDIT_PUBLISHED_ERROR:
    // 	return state
    // 		.set("loading", false)
    // 		.set("error", action.error);
    case draftItemActions.PUBLISH_DRAFT_REQUEST:
      return state
        .set("loading", true)
        .set("errors", [])
        .set("formErrors", Set([]))
        .set("extraErrors", {});
    case draftItemActions.PUBLISH_DRAFT_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.PUBLISH_DRAFT_ERROR:
      return state.set("extraErrors", action.errors).set("loading", false);

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
        )
        .set("bucketFileLinks", action.bucket.links);

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

    // Draft integrations
    case filesActions.CREATE_WEBHOOK_SUCCESS:
      return state.set("webhooks", [...state.get("webhooks"), action.repo]);

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

    //file Versions
    case filesActions.FILE_VERSIONS_REQUEST:
      return state.set("versionLoading", true);
    case filesActions.FILE_VERSIONS_SUCCESS:
      return state
        .set("versionLoading", false)
        .set("fileVersions", fromJS(action.payload));
    case filesActions.FILE_VERSIONS_ERROR:
      return state.set("versionLoading", false);
    default:
      return state;
  }
}
