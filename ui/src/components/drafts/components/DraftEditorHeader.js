import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";

import {
  CreateAnchor,
  SaveAnchor,
  SettingsAnchor,
  ShareAnchor,
  DiscardAnchor,
  DeleteAnchor,
  DraftMessage
} from "./DraftActionsButtons";

import EditableTitle from "./EditableTitle";

import DragIcon from "grommet/components/icons/base/Drag";
import DraftActionsLayer from "./DraftActionsLayer";

import {
  createDraft,
  createDraftError,
  updateDraft,
  publishDraft,
  deleteDraft,
  discardDraft,
  editPublished,
  toggleActionsLayer
} from "../../../actions/draftItem";

class DraftEditorHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = { actionType: null };
  }

  _validateFormData() {
    // TOFIX maybe fetch formData from store instead of ref
    const formData = this.props.formRef.current.props.formData;
    const { errors } = this.props.formRef.current.validate(formData);

    let e = new Event("save");

    this.props.formRef.current.onSubmit(e);

    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  _createDraft(schema_id) {
    if (
      this.props.formData == null ||
      this.formData == {} ||
      this.formData == ""
    ) {
      this.props.createDraftError(
        "Form is empty. Please add some content first and try saving again"
      );
      return;
    }

    if (this._validateFormData())
      this.props.createDraft(this.props.formData, schema_id).catch(error => {
        this._validateFormData();
      });
  }

  _saveData() {
    if (this._validateFormData()) {
      let status = this.props.status;

      if (status == "draft")
        this.props
          .updateDraft({ ...this.props.formData }, this.props.draft_id)
          .finally(() => {
            this._validateFormData();
          });
      else if (status == "published")
        this.props
          .editPublished(
            { ...this.props.formData, $schema: this.props.draft.$schema },
            this.props.match.params.schema_id,
            this.props.draft_id
          )
          .finally(() => {
            this._validateFormData();
          });
    }
  }

  _publishData() {
    this.props.publishDraft(this.props.draft_id);
  }

  _deleteDraft() {
    this.props.deleteDraft(this.props.draft_id);
  }

  _discardData() {
    this.props.discardDraft(this.props.draft_id);
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer();
    this.setState({ actionType: type });
  };

  render() {
    let status = this.props.status;

    let isDraft = status == "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

    // ******** NEEDED
    // if (
    //   (this.props.errors && this.props.error.status == 403) ||
    //   (this.props.schemaError && this.props.schemaError.status == 403)
    // )
    //   return null;

    return (
      <Box flex={true} wrap={false} direction="row">
        <Box
          pad={{ horizontal: "small" }}
          justify="start"
          align="center"
          direction="row"
          flex={true}
          wrap={false}
        >
          <Box margin={{ right: "small" }}>
            <DragIcon size="xsmall" />
          </Box>
          <EditableTitle anaType={this.props.match.params.schema_id} />
        </Box>

        <Box flex={true} justify="center" align="end">
          <DraftMessage
            key="draft-message"
            message={this.props.message}
            loading={this.props.loading}
          />
        </Box>
        <Box flex={false} direction="row" wrap={false} justify="end">
          {isDraft ? (
            <Menu
              flex={false}
              direction="row"
              wrap={false}
              responsive={false}
              margin={{ vertical: "small", right: "large" }}
              pad={{ horizontal: "small" }}
              alignContent="center"
              justify="center"
              align="center"
              colorIndex="neutral-4"
            >
              <ShareAnchor action={this._actionHandler("publish")} />
            </Menu>
          ) : null}

          {this.props.draft_id ? (
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
              <SettingsAnchor draft_id={this.props.draft_id} />

              {isDraft && !isPublishedOnce ? (
                <DeleteAnchor action={this._actionHandler("delete")} />
              ) : null}

              {isDraft && isPublishedOnce ? (
                <DiscardAnchor action={this._actionHandler("discard")} />
              ) : null}

              <SaveAnchor action={this._saveData.bind(this)} />
            </Menu>
          ) : (
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
              <CreateAnchor
                onClick={this._createDraft.bind(this, this.props.schema)}
              />
            </Menu>
          )}
        </Box>
        <DraftActionsLayer
          key="action-layer"
          type={this.state.actionType}
          saveData={this._saveData.bind(this)}
          publishData={this._publishData.bind(this)}
          deleteDraft={this._deleteDraft.bind(this)}
          discardData={this._discardData.bind(this)}
        />
      </Box>
    );
  }
}

DraftEditorHeader.propTypes = {
  match: PropTypes.object.isRequired,
  draft: PropTypes.object,
  id: PropTypes.string
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
    errors: state.draftItem.get("errors")
    // schemaError: state.drafts.get("schemaError"),
    // loading: state.drafts.getIn(["current_item", "loading"]),
    // message: state.drafts.getIn(["current_item", "message"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDraft: (data, ana_type) => dispatch(createDraft(data, ana_type)),
    createDraftError: err => dispatch(createDraftError(err)),
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    publishDraft: draft_id => dispatch(publishDraft(draft_id)),
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    discardDraft: draft_id => dispatch(discardDraft(draft_id)),
    editPublished: (data, schema, draft_id) =>
      dispatch(editPublished(data, schema, draft_id)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftEditorHeader);
