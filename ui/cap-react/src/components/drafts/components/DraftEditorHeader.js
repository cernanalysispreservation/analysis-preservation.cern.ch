import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import cogoToast from "cogo-toast";

import Box from "grommet/components/Box";

import Label from "grommet/components/Label";

import {
  updateDraft,
  editPublished,
  toggleActionsLayer
} from "../../../actions/draftItem";
import { withRouter } from "react-router";
import { formErrorsChange } from "../../../actions/common";
import Button from "../../partials/Button";
import { AiOutlineSave } from "react-icons/ai";

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
      obj &&
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

    // we use Object.assign since we want to remove primitive type
    // otherwise the swallow copy will not work
    const formDataWithoutGeneralTitle = Object.assign({}, formData);
    delete formDataWithoutGeneralTitle.general_title;

    // if the form is empty display warning and return false
    // if not save it
    if (this._checkIfEmpty(formDataWithoutGeneralTitle)) {
      cogoToast.warn(
        "Please add some content first, and try saving again",
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
        <Box
          flex
          direction="row"
          wrap={false}
          justify="between"
          responsive={false}
        >
          <Box direction="row" align="center" responsive={false}>
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
              text="Edit"
              margin="0 5px"
              size="small"
              primary={this.props.mode === "edit"}
              onClick={() =>
                this.props.mode !== "edit" && this.props.onChangeMode("edit")
              }
            />
            <Button
              text="Preview"
              margin="0 5px"
              size="small"
              primary={this.props.mode === "preview"}
              onClick={() =>
                this.props.mode === "edit" && this.props.onChangeMode("preview")
              }
            />
          </Box>
          <Box>
            {this.props.draft_id && (
              <Box justify="center" align="center">
                <Button
                  margin="0 0 0 20px"
                  text="Save"
                  className="save-btn"
                  onClick={this._saveData.bind(this)}
                  icon={<AiOutlineSave />}
                  disabled={this.props.mode !== "edit"}
                  loading={this.props.loading}
                  background="#e1e1e1"
                  hoverColor="#e9e9e9"
                />
              </Box>
            )}
          </Box>
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
  publishDraft: PropTypes.func,
  formData: PropTypes.object,
  toggleActionsLayer: PropTypes.func,
  deleteDraft: PropTypes.func,
  schema: PropTypes.object,
  status: PropTypes.string,
  draft_id: PropTypes.string,
  recid: PropTypes.string,
  formErrorsChange: PropTypes.func,
  onChangeMode: PropTypes.func,
  mode: PropTypes.string
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
