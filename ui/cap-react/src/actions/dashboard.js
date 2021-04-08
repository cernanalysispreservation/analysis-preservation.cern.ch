import axios from "axios";

export const DASHBOARD_QUERY_REQUEST = "DASHBOARD_QUERY_REQUEST";
export const DASHBOARD_QUERY = "DASHBOARD_QUERY";
export const DASHBOARD_QUERY_ERROR = "DASHBOARD_QUERY_ERROR";

export function dashboardQueryRequest() {
  return {
    type: DASHBOARD_QUERY_REQUEST
  };
}
export function dashboardQuerySuccess(results) {
  return {
    type: DASHBOARD_QUERY,
    results
  };
}
export function dashboardQueryError(error) {
  return {
    type: DASHBOARD_QUERY_ERROR,
    error
  };
}
export function fetchDashboard() {
  return dispatch => {
    dispatch(dashboardQueryRequest());
    let url = "/api/dashboard";

    axios
      .get(url)
      .then(response => {
        let results = response.data;
        dispatch(dashboardQuerySuccess(results));
      })
      .catch(error => {
        dispatch(dashboardQueryError({...error.response}));
      });
  };
}
