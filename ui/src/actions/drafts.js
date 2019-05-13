import axios from "axios";
import { replace } from "react-router-redux";
import { fetchAndAssignSchema } from "./common";

export const TOGGLE_FILEMANAGER_LAYER = "TOGGLE_FILEMANAGER_LAYER";
export const TOGGLE_PREVIEWER = "TOGGLE_PREVIEWER";
export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const TOGGLE_LIVE_VALIDATE = "TOGGLE_LIVE_VALIDATE";
export const TOGGLE_CUSTOM_VALIDATION = "TOGGLE_CUSTOM_VALIDATION";
export const TOGGLE_VALIDATE = "TOGGLE_VALIDATE";
export const TOGGLE_ACTIONS_LAYER = "TOGGLE_ACTIONS_LAYER";

export const GENERAL_TITLE_CHANGED = "GENERAL_TITLE_CHANGED";
export const GENERAL_TITLE_REQUEST = "GENERAL_TITLE_REQUEST";
export const GENERAL_TITLE_SUCCESS = "GENERAL_TITLE_SUCCESS";
export const GENERAL_TITLE_ERROR = "GENERAL_TITLE_ERROR";

export const DRAFTS_REQUEST = "DRAFTS_REQUEST";
export const DRAFTS_SUCCESS = "DRAFTS_SUCCESS";
export const DRAFTS_ERROR = "DRAFTS_ERROR";

export const INIT_FORM = "INIT_FORM";

export const DRAFTS_ITEM_REQUEST = "DRAFTS_ITEM_REQUEST";
export const DRAFTS_ITEM_SUCCESS = "DRAFTS_ITEM_SUCCESS";
export const DRAFTS_ITEM_ERROR = "DRAFTS_ITEM_ERROR";

export const PUBLISH_DRAFT_REQUEST = "PUBLISH_DRAFT_REQUEST";
export const PUBLISH_DRAFT_SUCCESS = "PUBLISH_DRAFT_SUCCESS";
export const PUBLISH_DRAFT_ERROR = "PUBLISH_DRAFT_ERROR";

export const CREATE_DRAFT_REQUEST = "CREATE_DRAFT_REQUEST";
export const CREATE_DRAFT_SUCCESS = "CREATE_DRAFT_SUCCESS";
export const CREATE_DRAFT_ERROR = "CREATE_DRAFT_ERROR";

export const DELETE_DRAFT_REQUEST = "DELETE_DRAFT_REQUEST";
export const DELETE_DRAFT_SUCCESS = "DELETE_DRAFT_SUCCESS";
export const DELETE_DRAFT_ERROR = "DELETE_DRAFT_ERROR";

export const UPDATE_DRAFT_REQUEST = "UPDATE_DRAFT_REQUEST";
export const UPDATE_DRAFT_SUCCESS = "UPDATE_DRAFT_SUCCESS";
export const UPDATE_DRAFT_ERROR = "UPDATE_DRAFT_ERROR";

export const DISCARD_DRAFT_REQUEST = "DISCARD_DRAFT_REQUEST";
export const DISCARD_DRAFT_SUCCESS = "DISCARD_DRAFT_SUCCESS";
export const DISCARD_DRAFT_ERROR = "DISCARD_DRAFT_ERROR";

export const BUCKET_ITEM_REQUEST = "BUCKET_ITEM_REQUEST";
export const BUCKET_ITEM_SUCCESS = "BUCKET_ITEM_SUCCESS";
export const BUCKET_ITEM_ERROR = "BUCKET_ITEM_ERROR";

export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_ERROR = "UPLOAD_FILE_ERROR";

export const DELETE_FILE_REQUEST = "DELETE_FILE_REQUEST";
export const DELETE_FILE_SUCCESS = "DELETE_FILE_SUCCESS";
export const DELETE_FILE_ERROR = "DELETE_FILE_ERROR";

export const UPLOAD_TO_ZENODO_REQUEST = "UPLOAD_TO_ZENODO_REQUEST";
export const UPLOAD_TO_ZENODO_SUCCESS = "UPLOAD_TO_ZENODO_SUCCESS";
export const UPLOAD_TO_ZENODO_ERROR = "UPLOAD_TO_ZENODO_ERROR";

export const EDIT_PUBLISHED_REQUEST = "EDIT_PUBLISHED_REQUEST";
export const EDIT_PUBLISHED_SUCCESS = "EDIT_PUBLISHED_SUCCESS";
export const EDIT_PUBLISHED_ERROR = "EDIT_PUBLISHED_ERROR";

export const PERMISSIONS_ITEM_REQUEST = "PERMISSIONS_ITEM_REQUEST";
export const PERMISSIONS_ITEM_SUCCESS = "PERMISSIONS_ITEM_SUCCESS";
export const PERMISSIONS_ITEM_ERROR = "PERMISSIONS_ITEM_ERROR";

// TOFIX Consider using a HOC for error handling
export const CLEAR_ERROR_SUCCESS = "CLEAR_ERROR_SUCCESS";

export const FORM_DATA_CHANGE = "FORM_DATA_CHANGE";

export function draftsRequest() {
  return { type: DRAFTS_REQUEST };
}
export function draftsSuccess(drafts) {
  return { type: DRAFTS_SUCCESS, drafts };
}
export function draftsError(error) {
  return { type: DRAFTS_ERROR, error };
}

export function draftsItemRequest() {
  return { type: DRAFTS_ITEM_REQUEST };
}
export function draftsItemSuccess(draft_id, draft, permissions) {
  return { type: DRAFTS_ITEM_SUCCESS, draft_id, draft, permissions };
}
export function draftsItemError(error) {
  return { type: DRAFTS_ITEM_ERROR, error };
}

export function bucketItemRequest() {
  return { type: BUCKET_ITEM_REQUEST };
}
export function bucketItemSuccess(bucket_id, bucket) {
  return { type: BUCKET_ITEM_SUCCESS, bucket_id, bucket };
}
export function bucketItemError(error) {
  return { type: BUCKET_ITEM_ERROR, error };
}

export function uploadFileRequest(filename) {
  return { type: UPLOAD_FILE_REQUEST, filename };
}
export function uploadFileSuccess(filename, data) {
  return { type: UPLOAD_FILE_SUCCESS, filename, data };
}
export function uploadFileError(filename, error) {
  return { type: UPLOAD_FILE_ERROR, filename, error };
}

export function deleteFileRequest(filename) {
  return { type: DELETE_FILE_REQUEST, filename };
}
export function deleteFileSuccess(filename) {
  return { type: DELETE_FILE_SUCCESS, filename };
}
export function deleteFileError(filename, error) {
  return { type: DELETE_FILE_ERROR, filename, error };
}

export function publishDraftRequest() {
  return { type: PUBLISH_DRAFT_REQUEST };
}
export function publishDraftSuccess(published_id, published_record) {
  return { type: PUBLISH_DRAFT_SUCCESS, published_id, published_record };
}
export function publishDraftError(error) {
  return { type: PUBLISH_DRAFT_ERROR, error };
}

export function toggleFilemanagerLayer(selectable = false, action = null) {
  return {
    type: TOGGLE_FILEMANAGER_LAYER,
    selectable,
    action
  };
}

export function toggleActionsLayer() {
  return {
    type: TOGGLE_ACTIONS_LAYER
  };
}

export function initForm() {
  return { type: INIT_FORM };
}

export function togglePreviewer() {
  return { type: TOGGLE_PREVIEWER };
}
export function toggleSidebar() {
  return { type: TOGGLE_SIDEBAR };
}
export function toggleLiveValidate() {
  return { type: TOGGLE_LIVE_VALIDATE };
}
export function toggleCustomValidation() {
  return { type: TOGGLE_CUSTOM_VALIDATION };
}
export function toggleValidate() {
  return { type: TOGGLE_VALIDATE };
}

export function formDataChange(data) {
  return {
    type: FORM_DATA_CHANGE,
    data
  };
}

export function generalTitleChange(title) {
  return {
    type: GENERAL_TITLE_CHANGED,
    title
  };
}

export function generalTitleRequest() {
  return {
    type: GENERAL_TITLE_REQUEST
  };
}

export function generalTitleSuccess(title) {
  return {
    type: GENERAL_TITLE_SUCCESS,
    title
  };
}

export function generalTitleError(error) {
  return {
    type: GENERAL_TITLE_ERROR,
    error
  };
}

export function createDraftRequest() {
  return {
    type: CREATE_DRAFT_REQUEST
  };
}

export function createDraftSuccess(draft) {
  return {
    type: CREATE_DRAFT_SUCCESS,
    draft
  };
}

export function createDraftError(error) {
  return {
    type: CREATE_DRAFT_ERROR,
    error
  };
}

export function deleteDraftRequest() {
  return {
    type: DELETE_DRAFT_REQUEST
  };
}

export function deleteDraftSuccess() {
  return {
    type: DELETE_DRAFT_SUCCESS
  };
}

export function deleteDraftError(error) {
  return {
    type: DELETE_DRAFT_ERROR,
    error
  };
}

export function updateDraftRequest() {
  return {
    type: UPDATE_DRAFT_REQUEST
  };
}

export function updateDraftSuccess(draft_id, draft) {
  return {
    type: UPDATE_DRAFT_SUCCESS,
    draft_id,
    draft
  };
}

export function updateDraftError(error) {
  return {
    type: UPDATE_DRAFT_ERROR,
    error
  };
}

export function discardDraftRequest() {
  return {
    type: DISCARD_DRAFT_REQUEST
  };
}

export function discardDraftSuccess(draft_id, data) {
  return {
    type: DISCARD_DRAFT_SUCCESS,
    draft_id,
    data
  };
}

export function discardDraftError(error) {
  return {
    type: DISCARD_DRAFT_ERROR,
    error
  };
}

export function editPublishedRequest() {
  return {
    type: EDIT_PUBLISHED_REQUEST
  };
}

export function editPublishedSuccess(draft_id, draft) {
  return {
    type: EDIT_PUBLISHED_SUCCESS,
    draft_id,
    draft
  };
}

export function editPublishedError(error) {
  return {
    type: EDIT_PUBLISHED_ERROR,
    error
  };
}

export function permissionsItemRequest() {
  return {
    type: PERMISSIONS_ITEM_REQUEST
  };
}

export function permissionsItemSuccess(permissions) {
  return {
    type: PERMISSIONS_ITEM_SUCCESS,
    permissions
  };
}

export function permissionsItemError(error) {
  return {
    type: PERMISSIONS_ITEM_ERROR,
    error
  };
}


export function clearErrorSuccess() {
  return {
    type: CLEAR_ERROR_SUCCESS
  };
}

export function uploadToZenodoRequest() {
  return {
    type: UPLOAD_TO_ZENODO_REQUEST
  };
}

export function uploadToZenodoSuccess(element_id, status) {
  return {
    type: UPLOAD_TO_ZENODO_SUCCESS,
    element_id,
    status
  };
}

export function uploadToZenodoError(error) {
  return {
    type: UPLOAD_TO_ZENODO_ERROR,
    error
  };
}

// [TOFIX] Plug validation action if needed.
// export function validate(data, schema) {
//   return dispatch => {
//     dispatch(validateRequest());

//     data['$ana_type'] = schema;

//     axios.post('/api/deposit/validator', data)
//       .then(function(response) {
//         dispatch(validateSuccess(response.data));
//       })
//       .catch(function(error) {
//         dispatch(validateError(error));
//       })
//   };
// }

export function clearError() {
  return dispatch => {
    dispatch(clearErrorSuccess());
  };
}

export function createDraft(data = {}, schema, ana_type) {
  return (dispatch, getState) => {
    return dispatch(postCreateDraft(data, schema, ana_type))
      .then(() => {
        let currentState = getState();
        const draft_id = currentState.drafts.getIn(["current_item", "id"]);
        dispatch(replace(`/drafts/${draft_id}/edit`));
      })
      .catch(error => {
        dispatch(createDraftError(error.response));
        throw error;
      });
  };
}

export function createDraftFromCurrentItem(title, ana_type) {
  return (dispatch, getState) => {
    let currentState = getState();
    let formData =
      currentState.drafts.getIn(["current_item", "formData"]) || {};

    formData["general_title"] = title;

    return dispatch(createDraft(formData, null, ana_type));
  };
}

export function updateGeneralTitle(title, ana_type) {
  return (dispatch, getState) => {
    dispatch(generalTitleRequest());

    const draft_id = getState().drafts.getIn(["current_item", "id"]);

    if (draft_id) return dispatch(patchGeneralTitle(draft_id, title));
    else return dispatch(createDraftFromCurrentItem(title, ana_type));
  };
}

export function patchGeneralTitle(draft_id, title) {
  return (dispatch, getState) => {
    dispatch(generalTitleRequest());

    const general_title = getState().drafts.getIn([
      "current_item",
      "data",
      "general_title"
    ]);
    let uri = "/api/deposits/" + draft_id;

    let patch_data = [
      {
        op: general_title ? "replace" : "add",
        path: "/general_title",
        value: title
      }
    ];

    return axios
      .patch(uri, patch_data, {
        headers: { "Content-Type": "application/json-patch+json" }
      })
      .then(response => {
        if (response.status == 200) {
          dispatch(generalTitleSuccess(title));
        }
      })
      .catch(error => {
        dispatch(generalTitleError(error.response));
        throw error;
      });
  };
}

export function postCreateDraft(data = {}, schema, ana_type) {
  return dispatch => {
    dispatch(createDraftRequest());

    let uri = "/api/deposits/";
    data["$ana_type"] = ana_type;

    return axios
      .post(uri, data)
      .then(response => {
        let draft = response.data;
        if (draft.id) {
          dispatch(createDraftSuccess(response.data));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export function editPublished(data = {}, schema, draft_id) {
  return dispatch => {
    return dispatch(postAndPutPublished(data, schema, draft_id)).catch(
      error => {
        dispatch(dispatch(editPublishedError(error.response)));
        throw error;
      }
    );
  };
}

export function postAndPutPublished(data = {}, schema, draft_id) {
  return dispatch => {
    dispatch(editPublishedRequest());

    let uri = `/api/deposits/${draft_id}/actions/edit`;

    return axios
      .post(uri)
      .then(resp => {
        dispatch(editPublishedSuccess(draft_id, resp.data.metadata));
        data["$schema"] = schema;

        return axios
          .put(`/api/deposits/${draft_id}`, data)
          .then(response => {
            dispatch(updateDraftSuccess(draft_id, response.data));
          })
          .catch(error => {
            throw error;
          });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function discardDraft(draft_id) {
  return dispatch => {
    dispatch(discardDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/discard`;

    axios
      .post(uri)
      .then(response => {
        dispatch(discardDraftSuccess(draft_id, response.data.metadata));
      })
      .catch(error => {
        dispatch(discardDraftError(error));
      });
  };
}

export function updateDraft(data, draft_id) {
  return dispatch => {
    return dispatch(putUpdateDraft(data, draft_id)).catch(error => {
      dispatch(updateDraftError(error.response));
      throw error;
    });
  };
}

export function putUpdateDraft(data, draft_id) {
  return dispatch => {
    dispatch(updateDraftRequest());

    let uri = `/api/deposits/${draft_id}`;

    return axios
      .put(uri, data)
      .then(response => {
        dispatch(updateDraftSuccess(draft_id, response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function postPublishDraft(draft_id) {
  return dispatch => {
    dispatch(publishDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/publish`;

    return axios
      .post(uri)
      .then(response => {
        let pid = response.data.metadata._deposit.pid.value;
        dispatch(publishDraftSuccess(pid, response.data));
      })
      .catch(error => {
        throw error.response;
      });
  };
}

export function publishDraft(draft_id) {
  return (dispatch, getState) => {
    dispatch(postPublishDraft(draft_id))
      .then(() => {
        let currentState = getState();
        const pid = currentState.drafts.getIn(["current_item", "published_id"]);
        dispatch(replace(`/published/${pid}`));
      })
      .catch(error => {
        dispatch(publishDraftError(error));
        throw error;
      });
  };
}

export function deleteDraft(draft_id) {
  return dispatch => {
    dispatch(deleteDraftRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios
      .delete(uri)
      .then(() => {
        dispatch(deleteDraftSuccess());
        dispatch(replace("/"));
      })
      .catch(error => {
        dispatch(deleteDraftError(error.response));
      });
  };
}

export function getDraftById(draft_id, fetchSchemaFlag = false) {
  return dispatch => {
    dispatch(draftsItemRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios
      .get(uri, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        let url;
        if (fetchSchemaFlag && response.data.metadata.$schema) {
          url = response.data.metadata.$schema;
          dispatch(fetchAndAssignSchema(url));
        }
        dispatch(
          draftsItemSuccess(draft_id, response.data, response.data.access)
        );
        let bucket_id = response.data.links.bucket.split("/").pop();
        dispatch(getBucketById(bucket_id));
      })
      .catch(error => {
        const e = error.response
          ? error.response.data
          : {
              status: 400,
              message:
                "Something went wrong with your request. Please try again"
            };

        dispatch(draftsItemError(e));
      });
  };
}

export function getBucketById(bucket_id) {
  return dispatch => {
    dispatch(bucketItemRequest());

    let uri = `/api/files/${bucket_id}`;
    axios
      .get(uri)
      .then(response => {
        dispatch(bucketItemSuccess(bucket_id, response.data));
      })
      .catch(error => {
        dispatch(bucketItemError(error.response));
      });
  };
}

// Semi - working file upload
export function uploadFile(bucket_link, file) {
  return dispatch => {
    dispatch(uploadFileRequest(file.name));
    let bucket_id = bucket_link.split("/files/")[1];
    bucket_link = "/api/files/" + bucket_id;
    let uri = `${bucket_link}/${file.name}`;

    let oReq = new XMLHttpRequest();
    oReq.open("PUT", uri, true);
    oReq.onload = function(oEvent) {
      try {
        let data = oEvent.target.response;
        data = JSON.parse(data);
        dispatch(uploadFileSuccess(file.name, data));
      } catch (err) {
        dispatch(uploadFileError(file.name, err.message));
      }
    };

    oReq.onreadystatechange = function() {
      //Call a function when the state changes.
      if (oReq.readyState == XMLHttpRequest.DONE && oReq.status == 200) {
        // Request finished. Do processing here.
      }
    };

    oReq.addEventListener("error", function() {
      dispatch(uploadFileError(file.name, { message: "Error in uploading" }));
    });

    oReq.send(file);
  };
}

export function deleteFile(bucket, key) {
  return dispatch => {
    dispatch(deleteFileRequest(key));
    let uri = `/api/files/${bucket}/${key}`;
    axios
      .delete(uri)
      .then(dispatch(deleteFileSuccess(key)))
      .catch(error => {
        dispatch(deleteFileError(key, error));
      });
  };
}

export function uploadViaUrl(draft_id, urlToGrab, type) {
  return dispatch => {
    let uri = `/api/deposits/${draft_id}/actions/upload`;
    let data = urlToGrab.map(url => {
      return { url: url, type: type };
    });

    // TOFIX !!!WARNING!!! Change this so as to send the data in one request.
    data.map(d => {
      let filename = d.url.split("/").pop();
      d.type == "repo" ? (filename = `${filename}.tar.gz`) : filename;
      dispatch(uploadFileRequest(filename)),
        axios
          .post(uri, d)
          .then(response => {
            dispatch(uploadFileSuccess(filename, response.data));
          })
          .catch(error => {
            dispatch(uploadFileError(d.url, error));
          });
    });
  };
}

export function handlePermissions(draft_id, type, email, action, operation) {
  return dispatch => {
    dispatch(permissionsItemRequest());
    let data = _get_permissions_data(type, email, action, operation);
    let uri = `/api/deposits/${draft_id}/actions/permissions`;
    axios
      .post(uri, data)
      .then(response => {
        dispatch(permissionsItemSuccess(response.data.access));
      })
      .catch(error => {
        dispatch(permissionsItemError(error));
      });
  };
}

export function uploadToZenodo(element_id, bucket_id, filename) {
  return dispatch => {
    dispatch(uploadToZenodoRequest());
    let file = filename.split("/").pop();
    let uri = `/api/zenodo/${bucket_id}/${file}`;
    axios
      .get(uri)
      .then(response => {
        dispatch(uploadToZenodoSuccess(element_id, response.status));
      })
      .catch(error => {
        dispatch(uploadToZenodoError(error));
      });
  };
}

function _get_permissions_data(type, email, action, operation) {
  return [
    {
      type: `${type}`,
      email: `${email}`,
      op: `${operation}`,
      action: `${action}`
    }
  ];
}

// export function uploadFile(bucket_link, file) {
//   return function (dispatch) {
//     dispatch(draftsItemRequest());
//     bucket_link = bucket_link.replace('http:', 'https:');
//     let uri = `${bucket_link}/${file.name}`;

//     const data = new FormData();
//     data.append('file', file);
//     data.append('name', 'myfile');

//     // uri = uri+'?uploads&size=8&partSize=4'
//     // axios.post(uri, data)
//     //   .then((response) => {
//     //     console.log("UPLOADED fiel::::::",response.data)
//     //   })
//     //   .catch((error) => {
//     //     console.log("UPLOADED error::::::",error)
//     //   })
//     axios.put(uri, data)
//       .then((response) => {
//         console.log("UPLOADED fiel::::::",response.data)
//       })
//       .catch((error) => {
//         console.log("UPLOADED error::::::",error)
//       })

//   };
// }
