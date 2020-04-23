import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import cogoToast from "cogo-toast";

import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";
import Spinning from "grommet/components/icons/Spinning";

import { SaveAnchor, DraftMessage } from "./Buttons";

import {
  createDraft,
  createDraftError,
  updateDraft,
  editPublished,
  toggleActionsLayer
} from "../../../actions/draftItem";
import { withRouter } from "react-router";
import { formErrorsChange } from "../../../actions/common";
import { Label, Paragraph } from "grommet";

class DraftEditorHeader extends React.Component {
  // checks if the value is empty undefined or null
  isEmptyValues = value => {
    if (typeof value === "string") {
      return value.trim().length === 0;
    }
    if (value === undefined || value === null) {
      return true;
    }

    return value.length === 0;
  };

  // itertate through object values
  // if the value is not Object it calls isEmptyValues
  // if the values is an Object then recursive calls
  isObjectEmpty = (obj, arr) => {
    if (typeof obj !== "object") {
      this.isEmptyValues(obj) ? null : arr.push(obj);
    } else {
      Object.values(obj).length > 0 &&
        Object.values(obj).map(item => {
          let checkedValue;
          if (typeof item !== "object") {
            checkedValue = this.isEmptyValues(item);
          } else {
            checkedValue = this.isObjectEmpty(item, arr);
          }

          if (checkedValue === false) {
            arr.push(item);
          }
          return checkedValue;
        });
    }
  };

  //checks if the formData Object is an empty Object
  // by going through the data values and calling the isObjectEmpty for each of them
  _checkIfEmpty = data => {
    let emptyValuesArray = [];
    Object.values(data).map(item => {
      this.isObjectEmpty(item, emptyValuesArray);
    });
    return emptyValuesArray.length === 0;
  };

  _toErrorList(errorSchema, fieldName = "root") {
    // XXX: We should transform fieldName as a full field path string.
    let errorList = [];
    if ("__errors" in errorSchema) {
      errorList = errorList.concat(
        errorSchema.__errors.map(() => {
          return `${fieldName}`;
        })
      );
    }
    return Object.keys(errorSchema).reduce((acc, key) => {
      if (key !== "__errors") {
        acc = acc.concat(
          this._toErrorList(errorSchema[key], fieldName + "_" + key)
        );
      }
      return acc;
    }, errorList);
  }

  _validateFormData = () => {
    // TOFIX maybe fetch formData from store instead of ref
    const formData = this.props.formRef.current
      ? this.props.formRef.current.props.formData
      : null;

    const { errors = [], errorSchema } = this.props.formRef.current.validate(
      formData
    );

    this.props.formRef.current.submit();

    if (errors.length > 0) {
      cogoToast.error("Make sure all the fields are properly filled in", {
        position: "top-center",
        heading: "Form could not be submitted",
        bar: { size: "0" },
        hideAfter: 5
      });

      return { errorFlag: errors.length > 0, errorSchema };
    }

    // remove the 'general_title' from the form validation
    // since we tag the formData as empty if other than
    // ['general_title'] fields are missing
    delete formData.general_title;

    // if the form is empty display warning and return false
    // if not save it
    if (this._checkIfEmpty(formData)) {
      cogoToast.warn(
        "Please add some content first, and try again saving again",
        {
          position: "top-center",
          heading: "Form is empty",
          bar: { size: "0" },
          hideAfter: 3
        }
      );
      return { errorFlag: true, errorSchema: [] };
    } else {
      return { errorFlag: false, errorSchema: [] };
    }
  };

  _createDraft = schema_id => {
    if (this._validateFormData()) {
      this.props.createDraft(this.props.formData, schema_id).finally(() => {
        this._validateFormData();
      });
    }
  };

  _saveData() {
    let { errorFlag, errorSchema = [] } = this._validateFormData();

    let _errorData = this._toErrorList(errorSchema);

    // Use timeout to fire action on the next tick
    setTimeout(() => this.props.formErrorsChange(_errorData), 1);

    if (!errorFlag) {
      let status = this.props.status;
      if (status == "draft") {
        this.props
          .updateDraft({ ...this.props.formData }, this.props.draft_id)
          .finally(() => {
            let { errorSchema } = this._validateFormData();
            let _errorData = this._toErrorList(errorSchema);

            this.props.formErrorsChange(_errorData);
          });
      } else if (status == "published")
        this.props
          .editPublished(
            { ...this.props.formData, $schema: this.props.draft.$schema },
            this.props.match.params.schema_id,
            this.props.draft_id
          )
          .finally(() => {
            let { errorSchema } = this._validateFormData();
            let _errorData = this._toErrorList(errorSchema);

            this.props.formErrorsChange(_errorData);
          });
    }
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer(type);
  };

  render() {
    if (this.props.schemaErrors.length > 0) {
      return null;
    }

    return (
      <Box flex={true} wrap={false} direction="row">
        <Box flex={true} justify="center">
          <Label size="small" uppercase={true}>
            Metadata
          </Label>
          <Paragraph size="small" margin="none">
            Fill in the information the forrm to preserve a complete analysis
          </Paragraph>
        </Box>
        <Box flex={true} justify="center" align="end">
          <DraftMessage
            key="draft-message"
            message={this.props.message}
            loading={this.props.loading}
          />
        </Box>
        <Box flex={false} direction="row" wrap={false} justify="end">
          {this.props.loading ? (
            <Box
              flex={true}
              direction="row"
              align="center"
              margin={{ horizontal: "small" }}
            >
              <Spinning />
            </Box>
          ) : null}

          {this.props.draft_id && (
            <Menu
              flex={false}
              direction="row"
              wrap={false}
              responsive={false}
              size="small"
              pad={{ horizontal: "small" }}
              alignContent="center"
              justify="center"
              align="center"
            >
              <SaveAnchor action={this._saveData.bind(this)} />
            </Menu>
          )}
        </Box>
      </Box>
    );
  }
}

DraftEditorHeader.propTypes = {
  match: PropTypes.object.isRequired,
  draft: PropTypes.object,
  id: PropTypes.string,
  formRef: PropTypes.object,
  message: PropTypes.string,
  loading: PropTypes.bool,
  schemaErrors: PropTypes.array,
  discardDraft: PropTypes.func,
  updateDraft: PropTypes.func,
  editPublished: PropTypes.func,
  createDraft: PropTypes.func,
  publishDraft: PropTypes.func,
  formData: PropTypes.object,
  toggleActionsLayer: PropTypes.func,
  deleteDraft: PropTypes.func,
  schema: PropTypes.object,
  status: PropTypes.string,
  draft_id: PropTypes.string,
  recid: PropTypes.string,
  formErrorsChange: PropTypes.func
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    recid: state.draftItem.get("recid"),
    draft: state.draftItem.get("metadata"),
    schema: state.draftItem.get("schema"),
    status: state.draftItem.get("status"),
    // schema: state.draftItem.getIn(["current_item", "schema"]),
    formData: state.draftItem.get("formData"),
    // depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),
    errors: state.draftItem.get("errors"),
    schemaErrors: state.draftItem.get("schemaErrors"),
    loading: state.draftItem.get("loading")
    // loading: state.draftItem.getIn(["current_item", "loading"]),
    // message: state.drafts.getIn(["current_item", "message"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDraft: (data, ana_type) => dispatch(createDraft(data, ana_type)),
    createDraftError: err => dispatch(createDraftError(err)),
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    editPublished: (data, schema, draft_id) =>
      dispatch(editPublished(data, schema, draft_id)),
    toggleActionsLayer: type => dispatch(toggleActionsLayer(type)),
    formErrorsChange: errors => dispatch(formErrorsChange(errors))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftEditorHeader)
);
