import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import AppsIcon from "grommet/components/icons/base/Apps";

import EditableTitle from "./EditableTitle";

class DraftDefaultHeader extends React.Component {
  render() {
    if (this.props.error && this.props.error.status == 403) return null;

    return (
      <Box flex={true} direction="row">
        <Box direction="row" flex={true} wrap={false}>
          <Anchor
            path={{ path: `/drafts/${this.props.draft_id}`, index: true }}
            data-tip="Overview"
          >
            <AppsIcon />
          </Anchor>
          <Box
            pad="small"
            justify="center"
            flex={true}
            wrap={true}
            separator="left"
          >
            <EditableTitle />
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
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    draft: state.draftItem.get("metadata"),
    errors: state.draftItem.get("errors"),
    schema: state.draftItem.get("schema"),
    formData: state.draftItem.get("formData")
  };
}

export default connect(mapStateToProps)(DraftDefaultHeader);
