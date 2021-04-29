import React from "react";
import { PropTypes } from "prop-types";

import Modal from "../../../partials/Modal";
import Button from "../../../partials/Button";
import Header from "grommet/components/Header";

import AceEditor from "react-ace";

import "ace-builds/webpack-resolver";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import { DownloadIcon } from "grommet/components/icons/base";
import SettingsModal from "./SettingsModal";
import {
  AiOutlineSetting,
  AiOutlineArrowLeft,
  AiOutlineInfoCircle,
  AiOutlineControl
} from "react-icons/ai";
import { FaCode } from "react-icons/fa";
import JsonDiff from "./JSONDiff";

import Truncate from "react-truncate";
import GuidelinesPopUp from "./GuidelinesPopUp";
import ConfigModal from "./ConfigModal";
import { shoudDisplayGuideLinePopUp } from "../utils/common";

["json"].forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

class SchemaWizardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schemaPreviewEnabled: false,
      schemaPreviewDisplay: "schema",
      showModal: false,
      showGuidelines: false
    };
  }
  _getSchema = () => {
    const fileData = JSON.stringify(
      {
        deposit_schema: this.props.schema.toJS(),
        deposit_options: this.props.uiSchema.toJS(),
        ...this.props.config
      },
      null,
      4
    );

    const a = document.createElement("a");
    const file = new Blob([fileData], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = "fileName.json";
    a.click();
  };

  _renderSchemaPreview = () => {
    let previews = {
      uiSchema: (
        <AceEditor
          value={JSON.stringify(this.props.uiSchema.toJS(), null, 4)}
          mode="json"
          width="100%"
          height="100vh"
          readonly
        />
      ),
      schema: (
        <AceEditor
          value={JSON.stringify(this.props.schema.toJS(), null, 4)}
          mode="json"
          width="100%"
          height="100vh"
          readonly
        />
      ),
      uiSchemaDiff: (
        <JsonDiff
          left={this.props.initialUiSchema.toJS()}
          right={this.props.uiSchema.toJS()}
          show={false}
        />
      ),
      schemaDiff: (
        <JsonDiff
          left={this.props.initialSchema.toJS()}
          right={this.props.schema.toJS()}
          show={false}
        />
      )
    };

    return previews[this.state.schemaPreviewDisplay]; //?
    // previews[this.state.schemaPreviewDisplay] :
    // previews["schema"]
  };
  _updateSchemaTitle = value => {
    alert(`Updating schema title to: ${value}`);
  };

  _toggleSchemaPreviewEnabled = () =>
    this.setState({
      schemaPreviewEnabled: !this.state.schemaPreviewEnabled
    });

  _toggleSchemaPreviewDisplay = schemaPreviewDisplay =>
    this.setState({ schemaPreviewDisplay });

  render() {
    return [
      <Header
        key="header"
        pad={{ vertical: "none", horizontal: "small" }}
        size="small"
        fixed
      >
        <Box
          justify="between"
          direction="row"
          align="center"
          flex
          responsive={false}
        >
          <Box direction="row" align="center" responsive={false}>
            <Box
              margin={{ right: "small" }}
              onClick={() => this.props.history.push("/cms")}
            >
              <AiOutlineArrowLeft size={15} />
            </Box>
            {!this.props.loader && (
              <Truncate lines={1} width={200} ellipsis={<span>...</span>}>
                {(this.props.config && this.props.config.fullname) ||
                  "Untitled Schema"}
              </Truncate>
            )}
          </Box>
          <Box direction="row" wrap={false} pad={{ between: "small" }}>
            <Button
              icon={<DownloadIcon size="xsmall" />}
              text="Export Schema"
              size="small"
              onClick={this._getSchema}
            />
            <Button
              icon={<AiOutlineControl size={20} />}
              size="small"
              onClick={() => this.setState({ configModal: true })}
            />
            <Button
              icon={<FaCode size={20} />}
              size="small"
              onClick={this._toggleSchemaPreviewEnabled}
            />
            {!shoudDisplayGuideLinePopUp(this.props.schema) && (
              <Button
                size="small"
                onClick={() => this.setState({ showGuidelines: true })}
                icon={<AiOutlineInfoCircle size={20} />}
              />
            )}
            <Button
              icon={<AiOutlineSetting size={20} />}
              size="small"
              onClick={() => this.setState({ showModal: true })}
            />
          </Box>
        </Box>
      </Header>,
      this.state.showModal && (
        <SettingsModal
          show={this.state.showModal}
          onClose={() =>
            this.setState({
              showModal: false
            })
          }
        />
      ),
      this.state.configModal && (
        <ConfigModal
          show={this.state.configModal}
          onClose={() => this.setState({ configModal: false })}
        />
      ),
      this.state.schemaPreviewEnabled && (
        <Modal
          full
          onClose={this._toggleSchemaPreviewEnabled}
          title={
            <Box direction="row" align="center" responsive={false} flex={false}>
              <Label
                size="small"
                style={{
                  fontSize: "15px",
                  color: "#000",
                  fontWeight: "bold",
                  fontStyle: "italic"
                }}
              >
                Mode:
              </Label>
              <Button
                text="Schema"
                margin="0 5px"
                size="small"
                primary={this.state.schemaPreviewDisplay === "schema"}
                onClick={() => this._toggleSchemaPreviewDisplay("schema")}
              />
              <Button
                text="UI Schema"
                margin="0 5px"
                size="small"
                primary={this.state.schemaPreviewDisplay === "uiSchema"}
                onClick={() => this._toggleSchemaPreviewDisplay("uiSchema")}
              />
              <Button
                text="Schema Diff"
                margin="0 5px"
                size="small"
                primary={this.state.schemaPreviewDisplay === "schemaDiff"}
                onClick={() => this._toggleSchemaPreviewDisplay("schemaDiff")}
              />
              <Button
                text="UI Schema Diff"
                margin="0 5px"
                size="small"
                primary={this.state.schemaPreviewDisplay === "uiSchemaDiff"}
                onClick={() => this._toggleSchemaPreviewDisplay("uiSchemaDiff")}
              />
            </Box>
          }
        >
          <Box
            direction="row"
            size="xxlarge"
            wrap={false}
            style={{ height: "100%" }}
          >
            {this._renderSchemaPreview()}
          </Box>
        </Modal>
      ),
      this.state.showGuidelines && (
        <Modal flush onClose={() => this.setState({ showGuidelines: false })}>
          <GuidelinesPopUp />
        </Modal>
      )
    ];
  }
}

SchemaWizardHeader.propTypes = {
  config: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  initialUiSchema: PropTypes.object,
  initialSchema: PropTypes.object,
  history: PropTypes.object,
  loader: PropTypes.bool
};

export default SchemaWizardHeader;
