import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import { getPublishedItem } from "../../actions/published";

import RerunPublished from "../published/RerunPublished";
import RunsIndex from "../published/RunsIndex";

import PublishedPreview from "./PublishedPreview";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import PublishedSidebar from "./components/PublishedSidebar";

import DocumentTitle from "../partials/Title";
import PermissionDenied from "../errors/403";
import {
  PUBLISHED_ITEM,
  PUBLISHED_ITEM_RUNS,
  PUBLISHED_ITEM_RUNS_CREATE
} from "../routes";

class PublishedItemIndex extends React.Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    if (this.props.error && [403, 404 , 500].indexOf(this.props.error.status) > -1)
      return (
        <PermissionDenied
          status={this.props.error.status}
          message={this.props.error.message}
        />
      );
    return (
      <DocumentTitle title={`${this.props.match.params.id} | Published`}>
        <Box flex={true} direction="row">
          <Route exact path={PUBLISHED_ITEM} component={PublishedPreview} />
          {this.props.item &&
          this.props.item.metadata &&
          this.props.item.metadata.workflows &&
          this.props.item.metadata.workflows.length > 0 ? (
            <Route exact path={PUBLISHED_ITEM_RUNS} component={RunsIndex} />
          ) : null}
          {this.props.item &&
          this.props.item.metadata &&
          this.props.item.metadata.workflows &&
          this.props.item.metadata.workflows.length > 0 ? (
            <Route
              exact
              path={PUBLISHED_ITEM_RUNS_CREATE}
              component={RerunPublished}
            />
          ) : null}
          {this.props.item &&
          this.props.item.metadata &&
          this.props.item.metadata.workflows &&
          this.props.item.metadata.workflows.length > 0 ? (
            <PublishedSidebar />
          ) : null}
        </Box>
      </DocumentTitle>
    );
  }
}

PublishedItemIndex.propTypes = {
  startDeposit: PropTypes.func,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  match: PropTypes.object,
  error: PropTypes.object
};

const mapStateToProps = state => {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"]),
    item: state.published.getIn(["current_item", "data"]),
    error: state.published.get("error")
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublishedItemIndex)
);
