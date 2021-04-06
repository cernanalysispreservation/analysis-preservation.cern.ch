import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Box from "grommet/components/Box";

import { initForm, formDataChange } from "../../actions/draftItem";

import { fetchSchemaByNameVersion } from "../../actions/common";

import Form from "./form/Form";
import DraftJSONPreviewer from "./components/DraftJSONPreviewer";
import PermissionDenied from "../errors/403";
import DraftEditorHeader from "./components/DraftEditorHeader";
import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";

export const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "_review",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "_fetched_from",
    "_user_edited",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies,
    required: schema.required
  };

  return schema;
};

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode:
        (this.props.location.state && this.props.location.state.mode) || "edit"
    };
  }
  componentDidMount() {
    // If "schema_id" from URL exists init form and fetch schema
    if (this.props.match.params.schema_id) {
      this.props.initForm();
      this.props.fetchSchemaByNameVersion(this.props.match.params.schema_id);
      // this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
    }
  }

  // componentDidUpdate(prevProps) {
  // if (
  //   this.props.match.params.schema_id !== prevProps.match.params.schema_id
  // ) {
  //   this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
  // }
  // if (this.props.schemaId) {
  //   if (!this.props.schemasLoading) {
  //     if (
  //       this.props.schemas == null ||
  //       this.props.schemaId != this.props.schemas.schemaId
  //     ) {
  //       this.props.fetchAndAssignSchema(this.props.schemaId);
  //     }
  //   }
  // }
  // }

  render() {
    if (this.props.schemaErrors.length > 0) {
      return (
        <PermissionDenied
          status={this.props.schemaErrors[0].status}
          message={this.props.schemaErrors[0].message}
        />
      );
    }

    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;

    return (
      <Box id="draft-editor-page" flex={true} style={{ position: "relative" }}>
        {this.props.schemas &&
          this.props.schemas.schema && (
            <Box flex={true}>
              {this.props.canUpdate && (
                <Box flex={false} separator="bottom" style={{ padding: "5px" }}>
                  <DraftEditorHeader
                    formRef={this.props.formRef}
                    mode={this.state.mode}
                    onChangeMode={mode => this.setState({ mode })}
                  />
                </Box>
              )}
              <Box
                direction="row"
                justify="between"
                alignContent="end"
                flex={true}
                wrap={false}
              >
                {this.state.mode === "edit" ? (
                  <React.Fragment>
                    <Form
                      formRef={this.props.formRef}
                      formData={this.props.formData || {}}
                      schema={_schema}
                      uiSchema={this.props.schemas.uiSchema || {}}
                      onChange={change => {
                        this.props.formDataChange(change.formData);
                      }}
                      extraErrors={this.props.extraErrors || {}}
                    />
                    <DraftJSONPreviewer />
                  </React.Fragment>
                ) : (
                  <JSONSchemaPreviewer
                    formData={this.props.formData}
                    schema={_schema}
                    uiSchema={this.props.schemas.uiSchema || {}}
                    onChange={() => {}}
                    displayViewButtons
                  >
                    <span />
                  </JSONSchemaPreviewer>
                )}
              </Box>
            </Box>
          )}
      </Box>
    );
  }
}

DraftEditor.propTypes = {
  match: PropTypes.object,
  initForm: PropTypes.func,
  schemas: PropTypes.object,
  schemasLoading: PropTypes.bool,
  schemaErrors: PropTypes.array,
  // schemaId: PropTypes.string,
  error: PropTypes.object,
  extraErrors: PropTypes.object,
  formData: PropTypes.object,
  draft_id: PropTypes.string,
  formDataChange: PropTypes.func,
  fetchAndAssignSchema: PropTypes.func,
  fetchSchemaByNameVersion: PropTypes.func,
  formRef: PropTypes.object,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  canUpdate: PropTypes.bool,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemaId: state.draftItem.get("schema"),
    draft_id: state.draftItem.get("id"),
    // schemasLoading: state.draftItem.getIn(["current_item", "schemasLoading"]),
    schemas: state.draftItem.get("schemas"),
    metadata: state.draftItem.get("metadata"),
    formData: state.draftItem.get("formData"),
    errors: state.draftItem.get("errors"),
    extraErrors: state.draftItem.get("extraErrors"),
    schemaErrors: state.draftItem.get("schemaErrors"),
    canUpdate: state.draftItem.get("can_update")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchemaByNameVersion: name => dispatch(fetchSchemaByNameVersion(name)),
    initForm: () => dispatch(initForm()),
    formDataChange: data => dispatch(formDataChange(data))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftEditor)
);
