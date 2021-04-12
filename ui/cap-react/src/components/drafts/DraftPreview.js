import _omit from "lodash/omit";

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import cogoToast from "cogo-toast";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";
import SectionBox from "../partials/SectionBox";
import InfoHeaderBox from "../partials/InfoHeaderBox";
import DepositFilesList from "../drafts/components/DepositFilesList";
import InfoArrayBox from "../partials/InfoArrayBox";

import { BsCodeSlash } from "react-icons/bs";
import { AiOutlineInbox, AiOutlineTag } from "react-icons/ai";
import Button from "../partials/Button";
import Notification from "../partials/Notification";
import { publishedToDraftStatus } from "../../actions/draftItem";
import ReviewModal from "../partials/Review/ReviewModal";
import ReviewList from "../partials/Review/ReviewList";

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "_fetched_from",
    "_user_edited",
    "control_number",
    "_review"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };
  return schema;
};

const DraftPreview = props => {
  const showToaster = error => {
    cogoToast.error(error, {
      hideAfter: 3
    });
  };

  const calculateCollaborators = access => {
    if (!access)
      return {
        users: 0,
        roles: 0,
        adminUsers: [],
        readUsers: [],
        updateUsers: [],
        allUsersEmails: []
      };

    const adminUsers = access["deposit-admin"].users.map(user => user.email);
    const readUsers = access["deposit-read"].users.map(user => user.email);
    const updateUsers = access["deposit-update"].users.map(user => user.email);
    const allRoles = [
      ...new Set(
        [...access["deposit-admin"].roles, ...access["deposit-read"].roles],
        ...access["deposit-update"].roles
      )
    ];

    const allEmails = [
      ...new Set([...adminUsers, ...readUsers, ...updateUsers])
    ];

    return {
      users: allEmails.length,
      roles: allRoles.length,
      adminUsers,
      readUsers,
      updateUsers,
      allUsersEmails: allEmails
    };
  };

  const { users, roles } = useMemo(() => calculateCollaborators(props.access), [
    props.access
  ]);

  let infoData = [
    {
      type: "info",
      content: (
        <Box direction="row" align="center" justify="center">
          <b>{props.revision}</b>
          <Box style={{ color: "rgba(0,0,0,1)", marginLeft: "5px" }}>
            revision
          </Box>
        </Box>
      )
    },
    {
      type: "collaboration",
      content: (
        <Box direction="row" align="center" justify="center" responsive={false}>
          <Box direction="row" align="center" justify="center">
            <b style={{ margin: "0 2px" }}>{users || 0}</b> users
          </Box>
          <Box>/</Box>

          <Box direction="row" align="center" justify="center">
            <b style={{ margin: "0 2px" }}>{roles || 0}</b> roles
          </Box>
        </Box>
      )
    },
    {
      type: "code",
      content: (
        <Box direction="row" align="center" justify="center">
          <b>{props.webhooks && props.webhooks.length}</b>
          <Box style={{ color: "rgba(0,0,0,1)", marginLeft: "5px" }}>
            repositories
          </Box>
        </Box>
      )
    },
    {
      type: "file",
      content: (
        <Box direction="row" align="center" justify="center">
          <b>{props.files && props.files.size}</b>
          <Box style={{ color: "rgba(0,0,0,1)", marginLeft: "5px" }}>files</Box>
        </Box>
      )
    },
    {
      type: "info",
      content: (
        <Box direction="row" align="center" justify="center">
          <b>{props.schema ? props.schema.version : "-"}</b>
          <Box style={{ color: "rgba(0,0,0,1)", marginLeft: "5px" }}>
            schema revision
          </Box>
        </Box>
      )
    }
  ];

  let _schema =
    props.schemas && props.schemas.schema
      ? transformSchema(props.schemas.schema)
      : null;

  return (
    <Box
      id="deposit-page"
      flex={true}
      direction="row"
      wrap={true}
      align="start"
      justify="center"
      colorIndex="light-1"
    >
      {props.error ? showToaster(props.error.message) : null}

      <Box
        flex={true}
        pad={{ between: "medium" }}
        direction="column"
        style={{ width: "100%", maxWidth: "960px" }}
      >
        <Box pad={{ horizontal: "medium" }}>
          <Box
            direction="row"
            responsive={false}
            justify="between"
            colorIndex="light-2"
            pad={{ horizontal: "medium" }}
            margin={{ vertical: "small" }}
            style={{ borderRadius: "3px" }}
          >
            {infoData.map((item, index) => (
              <InfoHeaderBox key={index} {...item} />
            ))}
          </Box>
        </Box>
        {props.status === "published" && (
          <Box pad={{ horizontal: "medium" }}>
            <Notification
              text="This is a published version. If you want to upload files and repos or update form metadata and the title you have to change to Draft mode"
              type="warning"
              action={
                <Button
                  dataCy="change-to-draft"
                  text="Change to Draft"
                  size="small"
                  onClick={() => props.edit(props.draft_id)}
                />
              }
            />
          </Box>
        )}
        {props.schemaType &&
          props.schemaType.name == "cms-stats-questionnaire" && (
            <Box pad={{ horizontal: "medium" }}>
              <Notification
                text={
                  <span>
                    <strong>ATTENTION: </strong>For your{" "}
                    {(props.schemaType && props.schemaType.fullname) ||
                      "document"}{" "}
                    to be <strong>reviewed</strong> you need to click on{" "}
                    <strong>"Publish"</strong> (in the settings tab) first
                  </span>
                }
              />
            </Box>
          )}
        <Box pad={{ horizontal: "medium" }}>
          <SectionBox
            header="Metadata"
            className="box-large-height"
            headerActions={
              <Box direction="row" align="center" responsive={false}>
                {props.canUpdate && (
                  <Button
                    text="Edit"
                    icon={<AiOutlineTag />}
                    onClick={() => {
                      props.history.push(`/drafts/${props.draft_id}/edit`);
                    }}
                  />
                )}
                <Button
                  text="Show More"
                  margin="0 0 0 5px"
                  onClick={() => {
                    props.history.push({
                      pathname: `/drafts/${props.draft_id}/edit`,
                      state: { mode: "preview" }
                    });
                  }}
                />
              </Box>
            }
            body={
              props.schemas && props.schemas.schema ? (
                <Box flex={true} style={{ padding: "0 0 12px 0" }}>
                  <JSONSchemaPreviewer
                    formData={props.metadata}
                    schema={_schema}
                    schemaType={props.schemaType}
                    uiSchema={props.schemas.uiSchema || {}}
                    onChange={() => {}}
                  >
                    <span />
                  </JSONSchemaPreviewer>
                </Box>
              ) : null
            }
          />
        </Box>

        {props.canReview && (
          <Box pad={{ horizontal: "medium" }}>
            <SectionBox
              header="Reviews"
              headerActions={<ReviewModal />}
              body={
                <Box pad="small">
                  <ReviewList />
                </Box>
              }
            />
          </Box>
        )}
        <Box pad={{ horizontal: "medium" }}>
          <SectionBox
            header="Connected Repositories"
            headerActions={null}
            body={
              props.webhooks && props.webhooks.length > 0 ? (
                <Box flex={true} pad="small">
                  <InfoArrayBox items={props.webhooks} type="repositories" />
                </Box>
              ) : (
                <Box align="center">
                  <Box
                    colorIndex="light-2"
                    style={{ borderRadius: "50%" }}
                    pad="small"
                  >
                    <BsCodeSlash size={25} />
                  </Box>
                  <Box pad="small">No connected repositories yet</Box>
                </Box>
              )
            }
          />
        </Box>

        <Box pad={{ horizontal: "medium" }}>
          <SectionBox
            header="Uploaded Repositories"
            headerActions={null}
            body={
              props.files &&
              props.files.size > 0 &&
              props.files.filter(item => item["key"].startsWith("repositories"))
                .size > 0 ? (
                <Box flex={true} pad="small">
                  <DepositFilesList
                    files={props.files}
                    renderList={["repositories"]}
                  />
                </Box>
              ) : (
                <Box align="center" pad="small">
                  <Box
                    colorIndex="light-2"
                    style={{ borderRadius: "50%" }}
                    pad="small"
                  >
                    <AiOutlineInbox size={25} />
                  </Box>
                  <Box pad="small">No uploaded repositories yet</Box>
                </Box>
              )
            }
          />
        </Box>

        <Box pad={{ horizontal: "medium" }}>
          <SectionBox
            header="Uploaded Files"
            headerActions={null}
            body={
              props.files &&
              props.files.size > 0 &&
              props.files.filter(
                item => !item["key"].startsWith("repositories")
              ).size > 0 ? (
                <Box flex={true} pad="small">
                  <DepositFilesList
                    files={props.files}
                    renderList={["files"]}
                  />
                </Box>
              ) : (
                <Box align="center" pad="small">
                  <Box
                    colorIndex="light-2"
                    style={{ borderRadius: "50%" }}
                    pad="small"
                  >
                    <AiOutlineInbox size={25} />
                  </Box>
                  <Box pad="small">No uploaded files yet</Box>
                </Box>
              )
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

DraftPreview.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  metadata: PropTypes.object,
  schemasLoading: PropTypes.bool,
  canUpdate: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object,
  workflows: PropTypes.array,
  repositories: PropTypes.array,
  schemaType: PropTypes.object,
  revision: PropTypes.string,
  schema: PropTypes.object,
  files: PropTypes.object,
  access: PropTypes.object,
  webhooks: PropTypes.array,
  history: PropTypes.object,
  canReview: PropTypes.bool,
  status: PropTypes.string,
  edit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    schemas: state.draftItem.get("schemas"),
    schemaType: state.draftItem.get("schema"),
    // schemasLoading: state.draftItem.get("schemasLoading"),
    canUpdate: state.draftItem.get("can_update"),
    canReview: state.draftItem.get("can_review"),
    draft_id: state.draftItem.get("id"),
    repositories: state.draftItem.get("repositories"),
    metadata: state.draftItem.get("metadata"),
    status: state.draftItem.get("status"),
    access: state.draftItem.get("access"),
    schema: state.draftItem.get("schema"),
    // schemasLoading: state.draftItem.get("schemasLoading"),
    webhooks: state.draftItem.get("webhooks"),
    files: state.draftItem.get("bucket"),
    revision: state.draftItem.get("revision")
  };
}

const mapDispatchToProps = dispatch => ({
  edit: draft_id => dispatch(publishedToDraftStatus(draft_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
