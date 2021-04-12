import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Sidebar from "grommet/components/Sidebar";

import { toggleFilemanagerLayer } from "../../../actions/draftItem";

import SectionHeader from "./SectionHeader";
import DepositFilesList from "./DepositFilesList";

import { Route } from "react-router-dom";

import TimeAgo from "react-timeago";

import { getBucketById } from "../../../actions/files";

import Tag from "../../partials/Tag";
import Button from "../../partials/Button";
import { AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { DRAFT_ITEM } from "../../routes";

import Notification from "../../partials/Notification"

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderAddFileIcon() {
    if (this.props.status !== "published") {
      if (this.props.canUpdate) {
        return (
          <Route
            path={DRAFT_ITEM}
            render={() => (
              <Button
                size="icon"
                icon={<AiOutlinePlus size={20} />}
                onClick={this.props.toggleFilemanagerLayer}
                hoverColor="#e6e6e6"
                background="#d9d9d9"
              />
            )}
          />
        );
      }
    }
  }

  _renderRefreshFilesButton() {
    if (this.props.status !== "published") {
      if (this.props.canUpdate) {
        return (
          <Route
            path={DRAFT_ITEM}
            render={() => (
              <Button
                size="icon"
                onClick={this._refreshFileList}
                icon={<AiOutlineReload size={20} />}
                hoverColor="#e6e6e6"
                background="#d9d9d9"
              />
            )}
          />
        );
      }
    }
  }

  _refreshFileList = () => {
    let { bucket } = this.props.links;
    let bucket_id = bucket.split("/").pop();
    this.props.getBucketById(bucket_id);
  };

  _getColorByStatus = status => {
    let colors = {
      draft: {
        bgcolor: "#e6f7ff",
        border: "rgba(0, 106, 147, 1)",
        color: "rgba(0, 106, 147, 1)"
      },
      published: {
        bgcolor: "#f9f0ff",
        border: "rgba(146,109,146,1)",
        color: "rgba(146,109,146,1)"
      }
    };

    return colors[status];
  };
  render() {

    return (
      <Sidebar
        full={false}
        colorIndex="light-2"
        className="lg-row"
        style={{ height: "100%" }}
      >
        <Box
          flex={false}
          pad="none"
          size={{ width: { min: "medium" } }}
          separator="bottom"
          margin={{ bottom: "medium" }}
        >
          <Box flex={false} pad="small" style={{ fontWeight: "100" }}>
            <Box
              justify="between"
              direction="row"
              margin={{ bottom: "small" }}
              responsive={false}
              wrap={false}
            >
              ID <span>{this.props.id}</span>
            </Box>
            {this.props.schema && (
              <Box
                direction="row"
                wrap={false}
                justify="between"
                margin={{ bottom: "small" }}
                responsive={false}
                align="center"
              >
                <span>Collection</span>
                <Tag
                  text={`${this.props.schema.fullname} v${
                    this.props.schema.version
                  }`}
                  size="small"
                />
              </Box>
            )}
            <Box
              justify="between"
              direction="row"
              margin={{ bottom: "small" }}
              responsive={false}
              align="center"
              data-cy="deposit-status-tag"
            >
              <span>Status</span>
              <Tag
                text={this.props.status}
                color={this._getColorByStatus(this.props.status)}
                size="small"
              />
            </Box>
            <Box
              justify="between"
              direction="row"
              margin={{ bottom: "small" }}
              responsive={false}
              align="center"
            >
              Creator
              <span>
                {this.props.created_by && this.props.created_by.email}
              </span>
            </Box>
            <Box
              justify="between"
              direction="row"
              margin={{ bottom: "small" }}
              responsive={false}
              align="center"
            >
              Created:
              {this.props.created && (
                <strong>
                  <TimeAgo date={this.props.created} minPeriod="60" />
                </strong>
              )}
            </Box>
            <Box
              justify="between"
              direction="row"
              margin={{ bottom: "small" }}
              responsive={false}
              align="center"
            >
              Last Updated:
              {this.props.updated && (
                <strong>
                  <TimeAgo date={this.props.updated} minPeriod="60" />
                </strong>
              )}
            </Box>
          </Box>
        </Box>
          {
            this.props.bucketError ?
            <Box  size={{ width: { max: "medium" } }} pad="small" align="center">
              <Notification
                action={this._renderRefreshFilesButton()}
                type={this.props.bucketError.status === 500 ?"error":"warning"}
                text="There is an error while loading files, please try again by clicking the refresh button"
              />
            </Box> :
              <Box flex={true} pad="none" colorIndex="light-2">
                <SectionHeader
                  label="Files | Data | Repos"
                  uppercase={true}
                  icon={
                    <Box
                      direction="row"
                      responsive={false}
                      wrap={false}
                      pad={{ between: "small" }}
                      margin={{ right: "small" }}
                    >
                      {this._renderRefreshFilesButton()}
                      {this._renderAddFileIcon()}
                    </Box>
                  }
                />
                <DepositFilesList files={this.props.files} />
              </Box>
          }
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  toggleFilemanagerLayer: PropTypes.func,
  files: PropTypes.object,
  created_by: PropTypes.object,
  updated: PropTypes.string,
  created: PropTypes.string,
  experiment: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  canUpdate: PropTypes.bool,
  links: PropTypes.object,
  getBucketById: PropTypes.func,
  schema: PropTypes.object
};

function mapStateToProps(state) {
  return {
    files: state.draftItem.get("bucket"),
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    schema: state.draftItem.get("schema"),
    experiment: state.draftItem.get("experiment"),
    revision: state.draftItem.get("revision"),
    created_by: state.draftItem.get("created_by"),
    created: state.draftItem.get("created"),
    updated: state.draftItem.get("updated"),
    canUpdate: state.draftItem.get("can_update"),
    links: state.draftItem.get("links"),
    bucketError: state.draftItem.get("bucketError")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    getBucketById: bucket_id => dispatch(getBucketById(bucket_id))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepositSidebar)
);
