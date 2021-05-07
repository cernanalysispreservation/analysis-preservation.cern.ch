import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionList from "./ConditionList";
import Button from "../../../../../../partials/Button";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import EmptyIcon from "./utils/emptyLogo";
import Label from "grommet/components/Label";
import { connect } from "react-redux";
import {
  updateConditionToSchemaConfig,
  updateEmailFromSchemaConfig,
  updateOperatorToCheck,
  updateChecksInConditions
} from "../../../../../../../actions/schemaWizard";

const NotificationWizard = ({
  updateSelectedAction,
  action,
  notifications,
  updateCondition,
  updateEmail,
  updateOperatorByPath,
  updateChecksInConditions,
  notification
}) => {
  return (
    <Box pad="small">
      <Box direction="row" align="center" responsive={false} justify="between">
        <Button
          margin="0 10px 0 0 "
          icon={<AiOutlineArrowLeft size={20} />}
          size="iconLarge"
          rounded
          onClick={() => updateSelectedAction()}
        />
        <Heading tag="h2" strong align="center">
          when {`${action}ed`}
        </Heading>
        <Box>
          {notification.getIn(["notifications", "actions", action]).size >
            0 && (
            <Button
              text="new condition"
              primary
              icon={<AiOutlinePlus />}
              onClick={() => updateCondition(action, "add")}
            />
          )}
        </Box>
      </Box>
      {notification.getIn(["notifications", "actions", action]).size == 0 && (
        <Box flex pad="small" align="center" justify="center">
          <Box colorIndex="light-2" pad="small">
            <EmptyIcon size="large" />
          </Box>
          <Label>Let's create some conditions and add emails </Label>
          <Button
            text="create conditions"
            primary
            size="large"
            onClick={() => updateCondition(action, "add")}
          />
        </Box>
      )}
      {notification
        .getIn(["notifications", "actions", action])
        .map((item, index) => (
          <Box margin={{ vertical: "small" }} key={index}>
            <Box justify="between" direction="row" margin={{ bottom: "small" }}>
              <Heading tag="h4" strong margin="none">
                #{index + 1} Condition
              </Heading>
              <Button
                text="Remove"
                criticalOutline
                onClick={() => updateCondition(action, "delete", index)}
              />
            </Box>
            <ConditionList
              item={item}
              updateConditions={path =>
                updateChecksInConditions(path, index, action, "add")
              }
              updateOperatorByPath={path =>
                updateOperatorByPath(path, index, action)
              }
              updateEmailList={email =>
                updateEmail(email, index, action, "add")
              }
              deleteByPath={path =>
                updateChecksInConditions(path, index, action, "delete")
              }
              removeEmail={email => updateEmail(email, index, action, "delete")}
            />
          </Box>
        ))}
    </Box>
  );
};

NotificationWizard.propTypes = {
  updateSelectedAction: PropTypes.func,
  action: PropTypes.string,
  updateCondition: PropTypes.func,
  updateEmail: PropTypes.func,
  updateOperatorByPath: PropTypes.func,
  updateChecksInConditions: PropTypes.func,
  notifications: PropTypes.array
};

const mapDispatchToProps = dispatch => ({
  updateCondition: (action, howToUpdate, index) =>
    dispatch(updateConditionToSchemaConfig(action, howToUpdate, index)),
  updateEmail: (email, index, action, howToUpdate) =>
    dispatch(updateEmailFromSchemaConfig(email, index, action, howToUpdate)),
  updateOperatorByPath: (path, index, action) =>
    dispatch(updateOperatorToCheck(path, index, action)),
  updateChecksInConditions: (path, index, action, howToUpdate) =>
    dispatch(updateChecksInConditions(path, index, action, howToUpdate))
});

export default connect(
  null,
  mapDispatchToProps
)(NotificationWizard);
