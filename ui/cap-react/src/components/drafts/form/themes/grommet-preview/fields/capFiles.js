import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import { connect } from "react-redux";
import Anchor from "../../../../../partials/Anchor";

import { AiOutlineDownload, AiOutlineWarning } from "react-icons/ai";

class CapField extends React.Component {
  render() {
    if (!this.props.formData) return <Box>-</Box>;

    let link;
    let file = this.props.files.get(this.props.formData);
    let bucket_id = file ? file.bucket : null;
    link = this.props.formContext.isPublished
      ? `/api/files/${bucket_id}/${this.props.formData}`
      : `${this.props.links.bucket}/${this.props.formData}`;

    let missedFileError = !this.props.files.has(this.props.formData);

    return (
      <Box
        style={{ wordBreak: "break-all" }}
        flex={true}
        direction="row"
        responsive={false}
      >
        <Anchor href={link} download disabled={missedFileError}>
          <Box direction="row" responsive={false} align="center">
            <AiOutlineDownload />
            <Box style={{ marginLeft: "5px" }}>{this.props.formData}</Box>
          </Box>
        </Anchor>
        {missedFileError && (
          <Box
            margin={{ left: "small" }}
            align="center"
            direction="row"
            style={{ color: "rgba(179, 53, 52, 1)" }}
          >
            <Box style={{ marginRight: "5px" }}>
              <AiOutlineWarning size={13} />
            </Box>
            This file is deleted
          </Box>
        )}
      </Box>
    );
  }
}

CapField.propTypes = {
  formData: PropTypes.object,
  formContext: PropTypes.object,
  links: PropTypes.object,
  files: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  links: state.draftItem.get("links"),
  files: ownProps.formContext.isPublished
    ? state.published.get("files")
    : state.draftItem.get("bucket")
});

export default connect(
  mapStateToProps,
  null
)(CapField);
