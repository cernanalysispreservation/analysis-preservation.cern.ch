import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionList from "./ConditionList";
import Button from "../../../../../../partials/Button";
import { AiOutlineArrowLeft, AiOutlinePlus } from "react-icons/ai";
import EmptyIcon from "./utils/emptyLogo";
import Label from "grommet/components/Label";

let conditions = [
  {
    op: "and",
    checks: [
      {
        path: "ml_app_use",
        if: "exists",
        value: "True"
      },
      {
        op: "or",
        checks: [
          {
            path: "first",
            if: "exists",
            value: "True"
          },
          {
            path: "second",
            if: "exists",
            value: "True"
          }
        ]
      }
    ],
    mails: {
      default: {
        cc: ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"],
        bcc: ["something-else@cern0.ch"],
        to: ["atlas@cern.ch"]
      }
    }
  }
];

const NotificationWizard = ({
  updateSelectedAction,
  action,
  notifications
}) => {
  const [myConditions, setMyConditions] = useState(notifications[action]);

  /**
   * Add a new check either simple or multiple
   * Based on the path
   */
  const updateConditions = (path, index) => {
    const newObject = {
      path: "general_title",
      if: "exists",
      value: "antonios"
    };

    const multiple = {
      op: "and",
      checks: [
        {
          path: "first",
          if: "equals",
          value: "yes"
        },
        {
          path: "second",
          if: "exists",
          value: "true"
        }
      ]
    };

    let c = myConditions[index];

    path.path.map(item => {
      if (!item.index) {
        c = c.checks;
      } else c = c[item.index].checks;
    });
    let itemToAdd = path.nested ? multiple : newObject;

    c.push(itemToAdd);
    setMyConditions([...myConditions]);
  };

  /**
   * Update the operator onClick, based on the path
   */
  const updateOperatorByPath = (path, index) => {
    let temp = myConditions[index];
    if (path.length > 1) {
      path.map((item, index) => {
        if (!item.index) {
          temp = temp.checks;
        } else {
          if (index === path.length - 1) temp = temp[item.index];
          else temp = temp[item.index].checks;
        }
      });
    }
    temp.op = temp.op === "and" ? "or" : "and";

    setMyConditions([...myConditions]);
  };

  const updateEmailList = (incoming, index) => {
    const { destination, email } = incoming;

    myConditions[index].mails.default[destination].push(email);
    setMyConditions([...myConditions]);
  };

  /**
   * Delete a check based on the path
   */
  const deleteByPath = (path, index) => {
    let temp = myConditions[index];
    let itemToDelete = path.pop();

    path.map((item, index) => {
      if (!item.index) {
        if (Array.isArray(temp)) temp = temp[0];
        else temp = temp.checks;
      } else {
        if (index === path.length - 1) {
          temp = temp[item.index];
        } else temp = temp[item.index].checks;
      }
    });

    let d = temp.checks ? temp.checks : temp;
    d = d.filter((_, index) => index !== itemToDelete.index);

    if (path.length === 1 && path[0] === "checks")
      myConditions[index].checks = d;
    else temp.checks = d;

    setMyConditions([...myConditions]);
  };

  /**
   * Remove email from a specific destination
   * e.x from the first condition and the list with bcc
   */
  const removeEmail = (incoming, index) => {
    let c = myConditions[index];
    const { destination, email } = incoming;

    c.mails.default[destination] = c.mails.default[destination].filter(
      item => item != email
    );

    setMyConditions([...myConditions]);
  };

  /**
   * adds new condition row
   */
  const addNewCondition = () => {
    const condition = {
      op: "and",
      checks: [
        {
          path: "ml_app_use",
          if: "exists",
          value: "True"
        }
      ],
      mails: {
        default: {
          cc: [],
          to: [],
          bcc: []
        }
      }
    };
    setMyConditions(conditions => [condition, ...conditions]);
  };

  /**
   * Removes a condition row based on the index
   */
  const removeCondition = i => {
    setMyConditions(cond => cond.filter((_, index) => index !== i));
  };

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
          {myConditions.length > 0 && (
            <Button
              text="new condition"
              primary
              icon={<AiOutlinePlus />}
              onClick={() => addNewCondition()}
            />
          )}
        </Box>
      </Box>
      {myConditions.length == 0 && (
        <Box flex pad="small" align="center" justify="center">
          <Box colorIndex="light-2" pad="small">
            <EmptyIcon size="large" />
          </Box>
          <Label>Let's create some conditions and add emails </Label>
          <Button
            text="create conditions"
            primary
            size="large"
            onClick={() => addNewCondition()}
          />
        </Box>
      )}
      {myConditions.map((item, index) => (
        <Box margin={{ vertical: "small" }} key={index}>
          <Box justify="between" direction="row" margin={{ bottom: "small" }}>
            <Heading tag="h4" strong margin="none">
              #{index + 1} Condition
            </Heading>
            <Button
              text="Remove"
              criticalOutline
              onClick={() => removeCondition(index)}
            />
          </Box>
          <ConditionList
            item={item}
            updateConditions={path => updateConditions(path, index)}
            updateOperatorByPath={path => updateOperatorByPath(path, index)}
            updateEmailList={email => updateEmailList(email, index)}
            deleteByPath={path => deleteByPath(path, index)}
            removeEmail={email => removeEmail(email, index)}
          />
        </Box>
      ))}
    </Box>
  );
};

NotificationWizard.propTypes = {
  updateSelectedAction: PropTypes.func,
  action: PropTypes.string
};

export default NotificationWizard;
