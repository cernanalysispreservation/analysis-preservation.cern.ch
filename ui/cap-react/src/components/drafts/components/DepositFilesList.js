import React from "react";
import PropTypes from "prop-types";

import ArchiveIcon from "grommet/components/icons/base/Archive";
import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
import PieChartIcon from "grommet/components/icons/base/PieChart";
import BookIcon from "grommet/components/icons/base/Book";
import NoteIcon from "grommet/components/icons/base/Note";
import Box from "grommet/components/Box";

// import PreviewUpload from "./PreviewUpload";

import FileTree from "./FileTree";

class DepositFilesList extends React.Component {
  constructor(props) {
    super(props);
  }

  _getIcon(type) {
    const catToIcon = {
      archive: <ArchiveIcon type="status" size="xsmall" />,
      configuration: <DocumentConfigIcon type="status" size="xsmall" />,
      dataset: <PieChartIcon type="status" size="xsmall" />,
      publication: <BookIcon type="status" size="xsmall" />,
      plot: <PieChartIcon type="status" size="xsmall" />
    };

    return catToIcon[type] ? (
      catToIcon[type]
    ) : (
      <NoteIcon type="status" size="xsmall" />
    );
  }

  render() {
    return [
      <Box key="filesList" style={{ paddingLeft: "3px", paddingRight: "10px" }}>
        <FileTree files={this.props.files} renderList={this.props.renderList} />
      </Box>
      // <PreviewUpload key="_file_previewer" />
    ];
  }
}

DepositFilesList.propTypes = {
  files: PropTypes.object,
  renderList: PropTypes.array
};

export default DepositFilesList;
