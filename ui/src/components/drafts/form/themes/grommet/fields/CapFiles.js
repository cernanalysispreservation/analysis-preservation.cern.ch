import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Button from "grommet/components/Button"

import Edit from "grommet/components/icons/base/FormEdit";
import CloudUploadIcon from "grommet/components/icons/base/CloudUpload";
import {
  toggleFilemanagerLayer,
  uploadToZenodo
} from "../../../../../../actions/drafts";

import Status from "grommet/components/icons/Status";

class CapFile extends React.Component {
  constructor(props) {
    super(props);
    let isZenodo = props.uiSchema["ui:options"]
      ? props.uiSchema["ui:options"]["zenodo"]
      : null;
    this.state = {
      layerActive: false,
      selected: {},
      isZenodo: isZenodo
    };
  }

  _toggleLayer() {
    this.setState(prevState => ({ layerActive: !prevState.layerActive }));
  }

  _selectItem(item) {
    this.setState({ selected: item });
  }

  _saveSelection() {
    this.setState(
      prevState => ({ layerActive: !prevState.layerActive }),
      () => this.props.onChange(this.state.selected)
    );
  }

  _onChange({ value }) {
    this.props.onChange(value);
  }

  _toggleFileManager() {
    this.props.toggleFilemanagerLayer(true, this.props.onChange);
  }

  render() {
    let bucket = this.props.links ? this.props.links.get("bucket") : null;
    let bucket_id = bucket ? bucket.split("/").pop() : null;

    return (
      <Box
        pad="small"
        flex={true}
        direction="row"
        alignContent="center"
        align="center"
        justify="center"
        wrap={false}
      >
        {this.props.formData ? (
          <Box>
            <Box direction="row">
              <Box pad="small">{this.props.formData}</Box>
              <Anchor
                icon={<Edit />}
                onClick={this._toggleFileManager.bind(this)}
              />
            </Box>
            {this.state.isZenodo ? (
              <Box direction="row">
                <Button
                  icon={<CloudUploadIcon />}
                  label="Upload to zenodo"
                  onClick={() => {
                    this.props.uploadToZenodo(
                      this.props.idSchema.$id,
                      bucket_id,
                      this.props.formData
                    );
                  }}
                />
                {this.props.zenodoId == 200 ? (
                  <Box pad="small">
                    <Status value="ok" />
                  </Box>
                ) : null}
              </Box>
            ) : null}
          </Box>
        ) : (
          <React.Fragment>
            <Anchor
              label="Open File Manager"
              onClick={this._toggleFileManager.bind(this)}
            />
          </React.Fragment>
        )}
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
  formData: PropTypes.object,
  uploadToZenodo: PropTypes.func,
  links: PropTypes.object,
  zenodo: PropTypes.object,
  uiSchema: PropTypes.object,
  idSchema: PropTypes.object
};

function mapStateToProps(state, props) {
  return {
    links: state.drafts.getIn(["current_item", "links"]),
    zenodoId: state.drafts.getIn(["zenodo", props.idSchema.$id, "status"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: (selectable = false, action) =>
      dispatch(toggleFilemanagerLayer(selectable, action)),
    uploadToZenodo: (element_id, bucket_id, filename) =>
      dispatch(uploadToZenodo(element_id, bucket_id, filename))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CapFile);
