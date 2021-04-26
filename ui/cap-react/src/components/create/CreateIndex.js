import React from "react";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Button from "../partials/Button";

import CreateForm from "../drafts/components/CreateForm";
import Lock from "../../img/lock.svg";

const CreateIndex = props => {
  let allow = true;

  const { anatype } = props.match.params;

  if (anatype && props.contentTypes) {
    allow = props.contentTypes
      .map(item => item.get("deposit_group"))
      .includes(anatype);
  }

  const _getContent = allowed => {
    const choices = {
      true: (
        <Box flex align="center" colorIndex="light-2" justify="center">
          <Box colorIndex="light-1" separator="all">
            <CreateForm anatype={anatype} />
          </Box>
        </Box>
      ),
      false: (
        <Box
          flex
          align="center"
          justify="center"
          colorIndex="light-2"
          data-cy="create-form-error-page"
        >
          <Box align="center" pad="small">
            <Box>
              <Lock />
            </Box>
            <Label style={{ textAlign: "center" }}>
              Your account has no permissions for this type of analysis <br />{" "}
              or <br /> the analysis type is incorrect
            </Label>

            <Button
              text="Home"
              primary
              onClick={() => props.history.push("/")}
            />
          </Box>
        </Box>
      )
    };

    return choices[allowed];
  };
  return _getContent(allow);
};

CreateIndex.propTypes = {};

const mapStateToProps = state => ({
  contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIndex);
