import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

import DepositFileManager from "../../../../components/DepositFileManager/FileManager";

import { selectPath } from "../../../../../../actions/files";

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

  _onFileClick = ({ key }) => {
    this._onChange({ path: key, type: "file" });
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
          <React.Fragment>
            <Box margin={{ right: "small" }}>{this.props.formData}</Box>
            <Anchor label="Edit" onClick={this._toggleActiveLayer} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Anchor
              label="Select a file from your list to link here"
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
  pathSelected: PropTypes.object
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
