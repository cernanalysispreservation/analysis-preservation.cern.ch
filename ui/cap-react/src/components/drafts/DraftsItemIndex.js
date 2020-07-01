import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route, withRouter } from "react-router-dom";

import { Box } from "grommet";

import DraftHeader from "./components/DraftHeader";

// Draft containers
import DraftIntegrations from "./components/DraftIntegrations";
import DraftWorkflows from "../workflows";
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";

import Sidebar from "./components/DepositSidebar";
import RouteGuard from "../RouteGuard";

import PermissionDenied from "../errors/403";
import MediaQuery from "react-responsive";

// Actions
import { getDraftByIdAndInitForm } from "../../actions/draftItem";

import DraftsItemNav from "./DraftsItemNav";

class DraftsItemIndex extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
    this.state = {
      expanded: window.innerWidth > 1450
    };
  }
  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    if (draft_id) {
      this.props.getDraftById(draft_id);
    }
  }

  render() {
    if (this.props.errors && [403, 404].indexOf(this.props.errors.status) > -1)
      return (
        <PermissionDenied
          status={this.props.errors.status}
          message={this.props.errors.message}
        />
      );

    let { draft_id } = this.props.match.params;

    return (
      <Box flex={true} wrap={false} colorIndex="grey-3">
        <RouteGuard
          when={true}
          navigate={path => this.props.history.push(path)}
          shouldBlockNavigation={location => {
            if (!location.pathname.startsWith(`/drafts/${draft_id}`)) {
              return true;
            }
            return false;
          }}
        />
        <DraftHeader
          formRef={this.formRef}
          expanded={this.state.expanded}
          expandCollapse={() =>
            this.setState({ expanded: !this.state.expanded })
          }
        />
        <Box
          flex={true}
          className="drafts-index-container"
          style={{ position: "relative" }}
        >
          <DraftsItemNav />

          <Box flex={true} className="lg-column">
            <Box
              flex={true}
              colorIndex="light-1"
              style={{
                margin: "5px"
              }}
              responsive={false}
            >
              <Switch>
                <Route
                  exact
                  path={`/drafts/:draft_id`}
                  component={DraftPreview}
                />
                <Route
                  path={`/drafts/:draft_id/edit`}
                  render={props => (
                    <DraftEditor {...props} formRef={this.formRef} />
                  )}
                />} />
                <Route
                  path={`/drafts/:draft_id/settings`}
                  component={DraftSettings}
                />
                <Route
                  path={`/drafts/:draft_id/integrations`}
                  component={DraftIntegrations}
                />
                <Route
                  path={`/drafts/:draft_id/workflows`}
                  render={props => (
                    <DraftWorkflows draft_id={draft_id} {...props} />
                  )}
                />
              </Switch>
            </Box>
            <Box colorIndex="light-1">
              <MediaQuery
                minWidth={1450}
                onChange={matches => this.setState({ expanded: matches })}
              >
                <span />
              </MediaQuery>
              <Box
                colorIndex="light-1"
                className={
                  this.state.expanded
                    ? "sidebar-hide-small show-sidebar"
                    : "sidebar-hide-small hide-sidebar"
                }
              >
                <Sidebar />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftsItemIndex.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  recid: PropTypes.string,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemIndex)
);
