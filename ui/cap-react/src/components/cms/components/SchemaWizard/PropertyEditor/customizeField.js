import React from "react";

import Box from "grommet/components/Box";

import { PropTypes } from "prop-types";

import _debounce from "lodash/debounce";

import PropKeyEditorForm from "./PropertyKeyEditorForm";

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
          schema={this.props.schema && this.props.schema.toJS()}
          uiSchema={this.props.uiSchema && this.props.uiSchema.toJS()}
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
            {this.props.path.toJS().path.length === 0 &&
              SIZE_OPTIONS.map((size, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.sizeChange(size)}
                  style={{
                    border:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "1px solid black"
                        : null,
                    background:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "black"
                        : null,
                    color:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "white"
                        : null,
                    padding:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "0 2px"
                        : null,
                    borderRadius:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].size &&
                      size === this.props.uiSchema.toJS()["ui:options"].size
                        ? "3px"
                        : null
                  }}
                >
                  {size}
                </Box>
              ))}
          </Box>
          {this.props.path.get("path").size > 0 && (
            <PropKeyEditorForm
              schema={this.props.schema && this.props.schema.toJS()}
              uiSchema={this.props.uiSchema && this.props.uiSchema.toJS()}
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
            {this.props.path.toJS().path.length === 0 &&
              ALIGN_OPTIONS.map((align, index) => (
                <Box
                  key={index}
                  flex={false}
                  margin="small"
                  onClick={() => this.alignChange(align)}
                  style={{
                    border:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "1px solid black"
                        : null,
                    background:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "black"
                        : null,
                    color:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "white"
                        : null,
                    padding:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "0 2px"
                        : null,
                    borderRadius:
                      this.props.uiSchema &&
                      this.props.uiSchema.toJS()["ui:options"] &&
                      this.props.uiSchema.toJS()["ui:options"].align &&
                      align === this.props.uiSchema.toJS()["ui:options"].align
                        ? "3px"
                        : null
                  }}
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
  optionsSchema: PropTypes.object
};

export default CustomizeField;
