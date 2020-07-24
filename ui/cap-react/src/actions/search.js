import axios from "axios";
import queryString from "query-string";

import { history } from "../store/configureStore";

export const QUERY_CHANGED = "QUERY_CHANGED";
export const ADD_AGGS = "ADD_AGGS";
export const REMOVE_AGGS = "REMOVE_AGGS";
export const CLEAR_SEARCH = "CLEAR_SEARCH";
export const PAGE_CHANGE = "PAGE_CHANGE";

export const SEARCH_REQUEST = "SEARCH_REQUEST";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_ERROR = "SEARCH_ERROR";

export const UPDATE_EXPANDED_STATE = "UPDATE_EXPANDED_STATE";
export const UPDATE_COLLAPSED_FACETS = "UPDATE_COLLAPSED_FACETS";

export function searchRequest() {
  return {
    type: SEARCH_REQUEST
  };
}

export function searchSuccess(results) {
  return {
    type: SEARCH_SUCCESS,
    results
  };
}

export function updateExpandState(value) {
  return {
    type: UPDATE_EXPANDED_STATE,
    value
  };
}

export function updateCollapsedFacets(value) {
  return {
    type: UPDATE_COLLAPSED_FACETS,
    value
  };
}

export function searchError(error) {
  return {
    type: SEARCH_ERROR,
    error
  };
}

const SEARCH_PATH_TO_INDEX = {
  "/search": "records",
  "/drafts": "deposits"
};

const DEFAULT_INDEX = "records";

export const updateCollapsableFacetArray = value => (dispatch, getState) => {
  let state = getState();
  let collapsed = state.search.get("collapsed").toJS();
  let exists = collapsed.indexOf(value);

  if (exists === -1) {
    collapsed.push(value);
  } else {
    collapsed.splice(exists, 1);
  }

  dispatch(updateCollapsedFacets(collapsed));
};

export function fetchSearch(match) {
  return function(dispatch) {
    let { location: { pathname, search } = {} } = history;
    let index =
      pathname in SEARCH_PATH_TO_INDEX
        ? SEARCH_PATH_TO_INDEX[pathname]
        : DEFAULT_INDEX;
    let searchApiUrl = `/api/${index}/`;

    // If query exists, remove "?" from string, since
    // we construct later
    if (search[0] == "?") search = search.substr(1);

    let params = queryString.parse(search);
    let searchUrl = `${searchApiUrl}?${search}`;

    if (!("sort" in params)) searchUrl += "&sort=mostrecent";
    if (match.params.anatype) {
      searchUrl += `&type=${match.params.anatype}`;
      params.type = match.params.anatype;
    }

    dispatch(toggleAggs(params));
    dispatch(searchRequest());

    axios
      .get(searchUrl)
      .then(response => {
        let results = response.data;
        dispatch(searchSuccess(results));
      })
      .catch(error => {
        dispatch(searchError(error));
      });
  };
}

export function toggleAggs(selectedAggs) {
  return {
    type: ADD_AGGS,
    selectedAggs: selectedAggs
  };
}
