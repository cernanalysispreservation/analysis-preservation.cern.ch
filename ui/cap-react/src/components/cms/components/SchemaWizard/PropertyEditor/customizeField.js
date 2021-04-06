import React from "react";

import Box from "grommet/components/Box";

import { PropTypes } from "prop-types";

import _debounce from "lodash/debounce";

import PropKeyEditorForm from "./PropertyKeyEditorForm";
import "./customizeField.css";

const SIZE_OPTIONS = ["small", "large", "xlarge", "xxlarge", "full"];

const ALIGN_OPTIONS = ["center", "start", "end"];

class CustomizeField extends React.Component {
  static getDerivedStateFromProps(props) {
    return {
      schema: props.schema ? props.schema.toJS() : {}
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      schema: props.schema ? props.schema.toJS() : {},
      uiSchema: props.uiSchema ? props.uiSchema.toJS() : {},
      showDeleteLayer: false,
      updateId: ""
    };
  }

  _onSchemaChange = data => {
    this.setState({ schema: data.formData }, () => {
      this.props.onSchemaChange(
        this.props.path.get("path").toJS(),
        data.formData
      );
    });
  };

  _onUiSchemaChange = data => {
    this.setState({ uiSchema: data.formData }, () => {
      this.props.onUiSchemaChange(
        this.props.path.get("uiPath").toJS(),
        data.formData
      );
    });
  };

  sizeChange = newSize => {
    if (SIZE_OPTIONS.indexOf(newSize) < 0) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { size, ...restUIOptions } = uiOptions;

    size = newSize;
    let _uiOptions = { size, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  alignChange = newAlign => {
    if (["center", "start", "end"].indexOf(newAlign) < 0) return;

    let { uiSchema } = this.props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { align, ...restUIOptions } = uiOptions;

    align = newAlign;
    let _uiOptions = { align, ...restUIOptions };

    this.props.onUiSchemaChange(this.props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions
    });
  };

  render() {
    return (
      <Box flex={false}>
        <PropKeyEditorForm
          schema={this.props.schema}
          uiSchema={this.props.uiSchema}
          formData={this.state.schema}
          onChange={_debounce(this._onSchemaChange.bind(this), 500)}
          optionsSchemaObject="optionsSchema"
          optionsUiSchemaObject="optionsSchemaUiSchema"
          title="Schema Settings"
        />
        <Box>
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            {this.props.path.get("path").size === 0 &&
              SIZE_OPTIONS.map((size, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.sizeChange(size)}
                  className={
                    this.props.uiSchema &&
                    this.props.uiSchema.get("ui:options").size > 0 &&
                    this.props.uiSchema.getIn(["ui:options", "size"]) ===
                      size &&
                    "selectedOption"
                  }
                >
                  {size}
                </Box>
              ))}
          </Box>
          {this.props.path.get("path").size > 0 && (
            <PropKeyEditorForm
              schema={this.props.schema}
              uiSchema={this.props.uiSchema}
              formData={this.props.uiSchema && this.props.uiSchema.toJS()}
              onChange={_debounce(this._onUiSchemaChange.bind(this), 500)}
              optionsSchemaObject="optionsUiSchema"
              optionsUiSchemaObject="optionsUiSchemaUiSchema"
              title="UI Schema Settings"
            />
          )}
          <Box
            direction="row"
            wrap={true}
            align="start"
            justify="start"
            flex={false}
            colorIndex="light-1"
          >
            {this.props.path.get("path").size === 0 &&
              ALIGN_OPTIONS.map((align, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.alignChange(align)}
                  className={
                    this.props.uiSchema &&
                    this.props.uiSchema.get("ui:options").size > 0 &&
                    this.props.uiSchema.getIn(["ui:options", "align"]) ===
                      align &&
                    "selectedOption"
                  }
                >
                  {align}
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

CustomizeField.propTypes = {
  field: PropTypes.object,
  cancel: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  onSchemaChange: PropTypes.func,
  onUiSchemaChange: PropTypes.func,
  path: PropTypes.array,
  deleteByPath: PropTypes.func,
  optionsSchema: PropTypes.object,
  renameId: PropTypes.func
};

export default CustomizeField;
