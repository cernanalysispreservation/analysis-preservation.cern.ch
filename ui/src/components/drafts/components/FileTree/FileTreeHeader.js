import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";

import FolderIcon from "grommet/components/icons/base/Folder";

import { FaCaretRight, FaCaretDown } from "react-icons/fa";

import FileItem from "../FileItem";

import { selectPath } from "../../../../actions/files";

class FileTreeHeader extends React.Component {
  render() {
    let { data, pathSelected } = this.props;
    const isDirectory = data.children ? true : false;

    let _selected = false;
    if (
      this.props.onFileClick &&
      pathSelected &&
      pathSelected.path === data.name
    )
      _selected = true;

    return (
      <Box flex={true} justify="between" direction="row" wrap={false}>
        <Box
          flex={true}
          direction="row"
          wrap={false}
          style={{ backgroundColor: _selected ? "#6caf6c61" : "transparent" }}
        >
          <Box style={{ marginRight: "5px", width: "15px" }}>
            {isDirectory ? (
              <Box onClick={this.props.toggleCollapse}>
                {this.props.enabled ? (
                  <FaCaretDown width="4" />
                ) : (
                  <FaCaretRight width="4" />
                )}
              </Box>
            ) : null}
          </Box>
          {isDirectory ? (
            <Box
              direction="row"
              justify="center"
              align="center"
              style={{
                marginBottom: "3px",
                fontWeight: "900"
              }}
              onClick={
                this.props.onDirectoryClick
                  ? () => this.props.onDirectoryClick(data.name)
                  : this.props.toggleCollapse
              }
            >
              <Box justify="center" align="center" flex={false}>
                <FolderIcon size="xsmall" />
              </Box>
              <Box
                style={{ paddingLeft: "5px" }}
                direction="row"
                wrap={false}
                flex={true}
              >
                <Box flex={true} justify="between">
                  {data.name && truncateMiddleText(data.name)}
                </Box>
              </Box>
            </Box>
          ) : (
            <FileItem
              file={data.data ? data.data : data}
              filename={data.name}
              action={
                this.props.onFileClick
                  ? () => this.props.onFileClick(data.data)
                  : null
              }
            />
          )}
        </Box>
      </Box>
    );
  }
}

let truncateMiddleText = (fullStr, strLen = 35, separator = "...") => {
  if (fullStr.length <= strLen) return fullStr;

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

FileTreeHeader.propTypes = {
  selectPath: PropTypes.func,
  pathSelected: PropTypes.object,
  toggleCollapse: PropTypes.func,
  onFileClick: PropTypes.func,
  data: PropTypes.object,
  enabled: PropTypes.bool,
  onDirectoryClick: PropTypes.func
};

function mapStateToProps(state) {
  return {
    pathSelected: state.draftItem.get("pathSelected"),
    selectableActionLayer: state.draftItem.get(
      "fileManagerLayerSelectableAction"
    )
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectPath: (path, type) => dispatch(selectPath(path, type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTreeHeader);
