import React, { useState } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import Button from "../../../partials/Button";

import FormField from "grommet/components/FormField";

import { TextInput } from "grommet";
import { createDraft } from "../../../../actions/draftItem";

import PropTypes from "prop-types";

import equal from "deep-equal";
import cleanDeep from "clean-deep";

import Notification from "../../../partials/Notification";

const CreateForm = props => {
  const [title, setTitle] = useState("");

  const [contentType, setContentType] = useState(
    props.anatype
      ? props.anatype
      : props.contentTypes && props.contentTypes.size === 1
        ? props.contentTypes.first().get("deposit_group")
        : null
  );

  const _createDraft = () => {
    let data = {
      general_title: title
    };

    props.createDraft(data, { name: contentType });
  };

  return (
    <Box>
      <Box pad="medium" size={{ width: "xlarge" }} wrap={false} flex>
        <Box size="xlarge" colorIndex="light-1">
          {props.location.pathname.startsWith("/drafts/") &&
            !equal(cleanDeep(props.formData), cleanDeep(props.metadata)) && (
              <Notification
                type="warning"
                text="Your analysis has unsaved changes. Make sure to save the analysis before starting a new one"
              />
            )}
          <Heading tag="h4">
            Select the content type you want to create, give a title to
            distinguish from other records and start preserving!
          </Heading>
          <Box pad={{ vertical: "small" }}>
            <FormField label="General Title">
              <Box pad={{ horizontal: "medium" }}>
                <TextInput onDOMChange={() => setTitle(event.target.value)} />
              </Box>
            </FormField>
          </Box>
          <Box pad={{ vertical: "small" }}>
            <Box>
              <Box>
                <Box size={{ height: { max: "medium" } }}>
                  <Box
                    direction="row"
                    wrap
                    justify="between"
                    data-cy="deposit-group-list"
                  >
                    {props.contentTypes &&
                      props.contentTypes.map(type => (
                        <Box
                          key={type.get("deposit_group")}
                          onClick={() =>
                            setContentType(type.get("deposit_group"))
                          }
                          basis="1/2"
                          pad="small"
                          colorIndex={
                            type.get("deposit_group") === contentType
                              ? "light-1"
                              : "light-2"
                          }
                          separator="all"
                        >
                          <Box
                            flex
                            justify="between"
                            direction="row"
                            responsive={false}
                            wrap={false}
                            style={{ overflow: "visible" }}
                          >
                            <Label
                              size="small"
                              data-cy="deposit-group-name"
                              name={type.get("name")}
                            >
                              {type.get("name")}
                            </Label>
                            <Box justify="center">
                              {type.get("deposit_group") === contentType ? (
                                <CheckmarkIcon colorIndex="ok" size="xsmall" />
                              ) : null}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box align="end">
          <Button
            text="Start Preserving"
            primary
            disabled={!contentType}
            onClick={() => _createDraft()}
          />
        </Box>
      </Box>
    </Box>
  );
};

CreateForm.propTypes = {
  title: PropTypes.string,
  contentTypes: PropTypes.array,
  createDraft: PropTypes.func,
  anatype: PropTypes.string,
  metadata: PropTypes.object,
  formData: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  id: state.draftItem.get("id"),
  errors: state.draftItem.get("errors"),
  metadata: state.draftItem.get("metadata"),
  formData: state.draftItem.get("formData"),
  contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
});

const mapDispatchToProps = dispatch => ({
  createDraft: (data, type) => dispatch(createDraft(data, type))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateForm)
);
