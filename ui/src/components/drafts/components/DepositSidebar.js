import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Sidebar from "grommet/components/Sidebar";

import AddIcon from "grommet/components/icons/base/Add";

import { toggleFilemanagerLayer } from "../../../actions/draftItem";

import SectionHeader from "./SectionHeader";
import DepositFilesList from "./DepositFilesList";

import { Route } from "react-router-dom";

import TimeAgo from "react-timeago";

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderAddFileIcon() {
    return (
      <Route
        path="/drafts/:draft_id/"
        render={() => (
          <Anchor
            onClick={this.props.toggleFilemanagerLayer}
            size="xsmall"
            icon={<AddIcon />}
          />
        )}
      />
    );
  }

  render() {
    return (
      <Sidebar full={false} size="medium" colorIndex="light-2">
        <Box flex={false}>
          <SectionHeader label="Info & Details" />
          <Box flex={false} pad="small" style={{ fontWeight: "100" }}>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              separator="bottom"
              pad="small"
            >
              ID <span>{this.props.id}</span>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              separator="bottom"
              pad="small"
            >
              Status <span>{this.props.status}</span>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              separator="bottom"
              pad="small"
            >
              Experiment <span>{this.props.experiment}</span>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              separator="bottom"
              pad="small"
            >
              Creator <span>{this.props.created_by}</span>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              separator="bottom"
              pad="small"
            >
              Created:{" "}
              <strong>
                <TimeAgo date={this.props.created} minPeriod="60" />
              </strong>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
              pad="small"
            >
              Last Updated:{" "}
              <strong>
                <TimeAgo date={this.props.updated} minPeriod="60" />
              </strong>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              pad={{ vertical: "small" }}
            />
          </Box>
        </Box>
        <Box flex={true}>
          <SectionHeader
            label="Files | Data | Source Code"
            icon={this._renderAddFileIcon()}
          />
          <DepositFilesList files={this.props.files} />
        </Box>
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  toggleFilemanagerLayer: PropTypes.func,
  files: PropTypes.object
};

function mapStateToProps(state) {
  return {
    files: state.draftItem.get("bucket"),
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    experiment: state.draftItem.get("experiment"),
    revision: state.draftItem.get("revision"),
    created_by: state.draftItem.get("created_by"),
    created: state.draftItem.get("created"),
    updated: state.draftItem.get("updated")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepositSidebar)
);
