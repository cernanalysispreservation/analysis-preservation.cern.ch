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
import DraftsRouteGuard from "./DraftsRouteGuard";

import PermissionDenied from "../errors/403";
import MediaQuery from "react-responsive";

// Actions
import { getDraftByIdAndInitForm } from "../../actions/draftItem";

import DraftsItemNav from "./DraftsItemNav";

import DocumentTitle from "../partials/Title";
import DepositFileManager from "./components/DepositFileManager";
import {
  DRAFT_ITEM,
  DRAFT_ITEM_EDIT,
  DRAFT_ITEM_SETTINGS,
  DRAFT_ITEM_INTEGRATIONS,
  DRAFT_ITEM_WORKFLOWS
} from "../routes";

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
    if (this.props.errors && [403, 404, 500].indexOf(this.props.errors.status) > -1)
      return (
        <PermissionDenied
          status={this.props.errors.status}
          message={this.props.errors.message}
        />
      );

    let { draft_id } = this.props.match.params;

    return (
      <DocumentTitle
        title={
          this.props.metadata.general_title
            ? `${this.props.metadata.general_title} | Draft`
            : "Draft"
        }
      >
        <Box flex={true} wrap={false} colorIndex="grey-3">
          <DraftsRouteGuard draft_id={draft_id} />
          <DepositFileManager />
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
              <Box flex={true} colorIndex="light-1" responsive={false}>
                <Switch>
                  <Route exact path={DRAFT_ITEM} component={DraftPreview} />
                  <Route
                    path={DRAFT_ITEM_EDIT}
                    render={props => (
                      <DraftEditor {...props} formRef={this.formRef} />
                    )}
                  />} />
                  <Route path={DRAFT_ITEM_SETTINGS} component={DraftSettings} />
                  <Route
                    path={DRAFT_ITEM_INTEGRATIONS}
                    component={DraftIntegrations}
                  />
                  <Route
                    path={DRAFT_ITEM_WORKFLOWS}
                    render={props => (
                      <DraftWorkflows draft_id={draft_id} {...props} />
                    )}
                  />
                </Switch>
              </Box>
              <Box colorIndex="light-2">
                <MediaQuery
                  minWidth={1450}
                  onChange={matches => this.setState({ expanded: matches })}
                >
                  <span />
                </MediaQuery>
                <Box
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
      </DocumentTitle>
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
  history: PropTypes.object,
  metadata: PropTypes.object
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid"),
    metadata: state.draftItem.get("metadata")
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
