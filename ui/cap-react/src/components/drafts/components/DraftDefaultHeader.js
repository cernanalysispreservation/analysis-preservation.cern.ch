import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Anchor from "../../partials/Anchor";
import Box from "grommet/components/Box";
import {
  AiOutlineArrowLeft,
  AiOutlineFolderOpen,
  AiOutlineFolder
} from "react-icons/ai";

import { updateGeneralTitle } from "../../../actions/draftItem";

import EditableField from "../../partials/EditableField";

class DraftDefaultHeader extends React.Component {
  render() {
    if (this.props.error && this.props.error.status == 403) return null;

    return (
      <Box flex={true} direction="row">
        <Box direction="row" flex={true} wrap={false} responsive={false}>
          <Box
            align="center"
            justify="center"
            style={{ padding: "12px" }}
            data-tip={this.props.location.pageFrom || "Dashboard"}
            data-place="right"
          >
            <Anchor
              path={
                this.props.location.from
                  ? { path: this.props.location.from }
                  : { path: `/` }
              }
            >
              <AiOutlineArrowLeft
                style={{ height: "24px", width: "24px", color: "black" }}
              />
            </Anchor>
          </Box>
          <Box
            justify="center"
            flex={true}
            wrap={true}
            separator="left"
            className="align-center-md"
            pad={{ horizontal: "small" }}
          >
            <EditableField
              value={this.props.metadata.general_title}
              emptyValue={"Untitled document"}
              onUpdate={val => {
                if (val.trim() === "") return;
                this.props.updateGeneralTitle(val);
              }}
              isEditable={this.props.canUpdate}
              dataCy="general-title-input"
            />
          </Box>
          <Box align="center" justify="center" pad={{ horizontal: "small" }}>
            {this.props.expanded ? (
              <Box
                onClick={this.props.onClick}
                direction="row"
                responsive={false}
                justify="center"
                align="center"
              >
                <Box margin={{ right: "small" }}>
                  <AiOutlineFolderOpen
                    style={{ height: "24px", width: "24px", color: "black" }}
                  />
                </Box>
                Files
              </Box>
            ) : (
              <Box
                onClick={this.props.onClick}
                direction="row"
                responsive={false}
                justify="center"
                align="center"
              >
                <Box margin={{ right: "small" }}>
                  <AiOutlineFolder
                    style={{ height: "24px", width: "24px", color: "black" }}
                  />
                </Box>
                Files
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftDefaultHeader.propTypes = {
  draft: PropTypes.object,
  id: PropTypes.string,
  error: PropTypes.object,
  draft_id: PropTypes.string,
  canUpdate: PropTypes.bool,
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  location: PropTypes.object,
  metadata: PropTypes.object,
  updateGeneralTitle: PropTypes.func
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    draft: state.draftItem.get("metadata"),
    schema: state.draftItem.get("schema"),
    formData: state.draftItem.get("formData"),
    metadata: state.draftItem.get("metadata")
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateGeneralTitle: (title, anaType) =>
      dispatch(updateGeneralTitle(title, anaType))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DraftDefaultHeader));
