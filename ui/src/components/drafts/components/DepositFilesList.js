import React from "react";
import PropTypes from "prop-types";

import FileManager from "./DepositFileManager";

import ArchiveIcon from "grommet/components/icons/base/Archive";
import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
import PieChartIcon from "grommet/components/icons/base/PieChart";
import BookIcon from "grommet/components/icons/base/Book";
import NoteIcon from "grommet/components/icons/base/Note";
import Box from "grommet/components/Box";

import FileTree from "./FileTree";
import { connect } from "react-redux";

// Actions
import { draftItemTabsChange } from "../../..//actions/draftItem";

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

  _onFileClick = ({ key }) => {
    this.props.draftItemTabsChange(
      `/drafts/${this.props.draftId}/files/${key}`
    );
  };

  render() {
    return [
      <FileManager key="filesManager" files={this.props.files} />,
      <Box key="filesList" style={{ paddingLeft: "3px", paddingRight: "10px" }}>
        <FileTree
          files={this.props.files.toJS()}
          onFileClick={this._onFileClick}
        />
      </Box>
      // <PreviewUpload key="_file_previewer" />
    ];
  }
}

DepositFilesList.propTypes = {
  files: PropTypes.object,
  draftId: PropTypes.string,
  draftItemTabsChange: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    draftItemTabsChange: tab => dispatch(draftItemTabsChange(tab))
  };
}

function mapStateToProps(state) {
  return {
    draftId: state.draftItem.get("id")
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositFilesList);
