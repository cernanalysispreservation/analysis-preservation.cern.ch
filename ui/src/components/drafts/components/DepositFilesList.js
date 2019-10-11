import React from "react";
import PropTypes from "prop-types";

import FileManager from "./DepositFileManager";
import FileList from "./FileList";

import ArchiveIcon from "grommet/components/icons/base/Archive";
import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
import PieChartIcon from "grommet/components/icons/base/PieChart";
import BookIcon from "grommet/components/icons/base/Book";
import NoteIcon from "grommet/components/icons/base/Note";

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
      <FileManager key="filesManager" files={this.props.files} />,
      <FileList key="filesList" files={this.props.files} />
    ];
  }
}

DepositFilesList.propTypes = {
  files: PropTypes.object
};

export default DepositFilesList;
