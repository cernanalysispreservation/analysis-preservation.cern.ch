import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import DepositAccess from "../DepositAccess";
import DepositReviews from "../DepositReviews";
import { Paragraph, Heading } from "grommet";
import { connect } from "react-redux";
// Actions
import { toggleActionsLayer } from "../../../../actions/draftItem";

import ReactTooltip from "react-tooltip";

import Anchor from "../../../partials/Anchor";
import Button from "../../../partials/Button";
import {
  AiOutlineDelete,
  AiOutlineLink,
  AiOutlineNotification
} from "react-icons/ai";

import "./DepositSettings.css";

const BUTTON_IMAGE_SIZE = 18;

class DepositSettings extends React.Component {
  _actionHandler = type => () => {
    this.props.toggleActionsLayer(type);
  };
  render() {
    let isDraft = this.props.status === "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

    return (
      <Box
        flex={false}
        alignSelf="center"
        pad="small"
        className="deposit-settings"
      >
        <Box margin={{ vertical: "small" }}>
          <Heading tag="h3">Publish your analysis</Heading>
          <Box
            className="deposit-settings-row-to-column"
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: "3px",
              padding: "10px"
            }}
          >
            <Box>
              <Paragraph margin="none">
                <strong>Publishing</strong> is the way to preserve your work
                within CAP (and CAP only). <br /> It makes a snapshot of
                everything that your analysis contains - metadata, files, plots,
                repositories - assigning to it an unique versioned identifier.{" "}
                <br /> All members of your collaboration can search and
                reference published content. <br />Once published analysis
                cannot be deleted, but can be modified and published again with
                a new version tag.
              </Paragraph>{" "}
            </Box>
            <Box
              flex
              className="deposit-settings-publish-button"
              justify={isPublishedOnce ? "between" : "center"}
            >
              <Box
                align="center"
                margin={{ top: "small" }}
                data-tip={
                  this.props.canUpdate
                    ? null
                    : "your account has no permissions to publish"
                }
                data-cy="settings-publish-btn"
              >
                <Button
                  text={isPublishedOnce ? "Publish New Version" : "Publish"}
                  onClick={isDraft ? this.props.publishDraft : null}
                  disabled={!this.props.canUpdate || !isDraft}
                  icon={<AiOutlineNotification />}
                  primaryPublished
                />
                <ReactTooltip />
              </Box>

              <Box>
                {isPublishedOnce && (
                  <Box data-tip="Latest published version" align="end">
                    <Label size="small">Current Version</Label>
                    <Anchor path={`/published/${this.props.recid}`}>
                      <Box direction="row" align="center" responsive={false}>
                        <Label
                          size="small"
                          uppercase
                          style={{
                            color: "rgba(146,109,146,1)"
                          }}
                        >
                          {this.props.recid}
                        </Label>
                        <AiOutlineLink color="rgba(146,109,146,1)" />
                      </Box>
                    </Anchor>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          margin={{ bottom: "small" }}
          style={{ maxWidth: "920px", width: "100%" }}
        >
          <DepositAccess />
        </Box>
        <Box margin={{ bottom: "small" }}>
          <DepositReviews />
        </Box>
        {this.props.canAdmin && (
          <Box>
            <Heading tag="h3">Delete your analysis</Heading>
            <Box
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: "3px",
                padding: "10px"
              }}
              direction="row"
              align="center"
              justify="between"
              flex
              responsive={false}
            >
              {isDraft && !isPublishedOnce ? (
                <Paragraph margin="none">
                  <strong>Delete</strong> permantly your analysis and all
                  metadata
                </Paragraph>
              ) : (
                <Paragraph margin="none">
                  Your analysis has been already <strong>published once</strong>{" "}
                  and is <strong> no longer a draft</strong>. Therefore it is
                  not possible to delete it
                </Paragraph>
              )}
              <Box>
                <Button
                  dataCy="draft-delete-btn"
                  onClick={this._actionHandler("delete")}
                  icon={<AiOutlineDelete size={BUTTON_IMAGE_SIZE} />}
                  text="Delete"
                  criticalOutline
                  disabled={!(isDraft && !isPublishedOnce)}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

DepositSettings.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  publishDraft: PropTypes.func,
  status: PropTypes.string,
  recid: PropTypes.string,
  canUpdate: PropTypes.bool,
  canAdmin: PropTypes.bool,
  toggleActionsLayer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    recid: state.draftItem.get("recid"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    formData: state.draftItem.get("formData"),
    canAdmin: state.draftItem.get("can_admin")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    publishDraft: () => dispatch(toggleActionsLayer("publish")),
    toggleActionsLayer: type => dispatch(toggleActionsLayer(type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositSettings);
