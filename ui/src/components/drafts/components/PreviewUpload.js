import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import getFilePreview from "./getFilePreview";

const PreviewUpload = React.memo(({ file = {} }) => {
  let { links: { self: file_link = null } = {} } = file;
  file_link = file_link ? file_link.replace("/files/", "/api/files/") : null;

  return (
    <Box flex={true} colorIndex="grey-4">
      <Box flex={true}>{getFilePreview(file, file_link)}</Box>
    </Box>
  );
}, true);

const mapStateToProps = (state, props) => ({
  file: state.draftItem.getIn(["bucket", props.fileKey])
});

const mapDispatchToProps = dispatch => {
  return {};
};

PreviewUpload.propTypes = {
  open: PropTypes.bool,
  file: PropTypes.object,
  deleteFile: PropTypes.func,
  toggle: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewUpload);
