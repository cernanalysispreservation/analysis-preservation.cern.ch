import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

import DepositFileManager from "../../../../components/DepositFileManager/FileManager";

import { selectPath } from "../../../../../../actions/files";
import { AiOutlineWarning } from "react-icons/ai";

class CapFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLayer: false,
      selected: null
    };
  }

  _onChange = value => {
    if (value.type == "file" && value.path) this.props.onChange(value.path);
    this._toggleActiveLayer();
  };

  _toggleActiveLayer = () => {
    this.setState({ activeLayer: !this.state.activeLayer });
  };

  _onDirectoryClick = path => {
    this.props.selectPath(path, "dir");
  };

  _onFileClick = path => {
    this._onChange({ path, type: "file" });
  };
  _removeData = () => {
    this.props.onChange(undefined);
  };

  render() {
    return (
      <Box
        pad={{ horizontal: "medium" }}
        flex={true}
        direction="row"
        alignContent="start"
        align="center"
        wrap={false}
      >
        {this.props.formData ? (
          <Box flex direction="row" responsive={false} justify="between">
            <Box direction="row" responsive={false}>
              <Box margin={{ right: "small" }}>{this.props.formData}</Box>
              <Anchor label="Edit" onClick={this._toggleActiveLayer} />
            </Box>
            {!this.props.files.has(this.props.formData) && (
              <Box
                margin={{ right: "small" }}
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
            <Anchor label="Remove" onClick={this._removeData} />
          </Box>
        ) : (
          <React.Fragment>
            <Anchor
              label={
                (this.props.uiSchema &&
                  this.props.uiSchema.capFilesDescription) ||
                "Select a file or a repository from your list to link here"
              }
              onClick={this._toggleActiveLayer}
            />
          </React.Fragment>
        )}

        <DepositFileManager
          activeLayer={this.state.activeLayer}
          toggleLayer={this._toggleActiveLayer}
          files={this.props.files.toJS()}
          onDirectoryClick={null}
          onFileClick={this._onFileClick}
          onSelect={this._onChange}
          pathSelected={this.props.pathSelected}
        />
      </Box>
    );
  }
}

CapFile.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  onChange: PropTypes.func,
  properties: PropTypes.object,
  toggleFilemanagerLayer: PropTypes.func,
  files: PropTypes.object,
  formData: PropTypes.string,
  selectPath: PropTypes.func,
  pathSelected: PropTypes.object,
  uiSchema: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    selectPath: (path, type) => dispatch(selectPath(path, type))
  };
}

function mapStateToProps(state) {
  return {
    files: state.draftItem.get("bucket"),
    pathSelected: state.draftItem.get("pathSelected")
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CapFile);
