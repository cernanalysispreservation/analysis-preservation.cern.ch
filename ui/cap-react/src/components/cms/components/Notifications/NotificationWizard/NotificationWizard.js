import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionList from "./ConditionList";
import Button from "../../../../partials/Button";
import isEqual from "lodash/isEqual";

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
      }
    ],
    mails: {
      default: {
        cc: ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"],
        bcc: ["something-else@cern0.ch"],
        to: ["atlas@cern.ch"]
      }
    }
  },
  {
    op: "and",
    checks: [
      {
        path: "ml_app_use",
        if: "exists",
        value: "True"
      },
      {
        op: "and",
        checks: [
          {
            path: "some_other_field",
            if: "equals",
            value: "yes"
          },
          {
            op: "or",
            checks: [
              {
                path: "some_other_field",
                if: "equals",
                value: "yes"
              },
              {
                path: "some_field",
                if: "exists",
                value: "true"
              }
            ]
          }
        ]
      }
    ],
    mails: {
      default: {
        cc: ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"],
        bcc: ["something-else@cern0.ch"]
      }
    }
  },
  {
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
        cc: ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"],
        bcc: ["something-else@cern0.ch"]
      }
    }
  }
];

const NotificationWizard = props => {
  const [myConditions, setMyConditions] = useState(conditions);
  const [count, setCount] = useState(0);
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
    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  const updateOperatorByPath = (path, index) => {
    let c = myConditions[index];
    if (path.length > 1) {
      path.map((item, index) => {
        if (!item.index) {
          c = c.checks;
        } else {
          if (index === path.length - 1) c = c[item.index];
          else c = c[item.index].checks;
        }
      });
    }
    c.op = c.op === "and" ? "or" : "and";
    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  const updateEmailList = (incoming, index) => {
    const { destination, email } = incoming;

    let mailList = myConditions[index];
    mailList.mails.default[destination].push(email);
    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  const removeCondition = index => {
    myConditions.splice(index, 1);
    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  const deleteByPath = (path, index) => {
    let c = myConditions[index];
    let itemToDelete = path.pop();
    path.map((item, index) => {
      if (!item.index) {
        c = c.checks;
      } else {
        if (index === path.length - 1) c = c[item.index];
        else c = c[item.index].checks;
      }
    });

    let d = c.checks ? c.checks : c;
    d = d.filter(item => !isEqual(item, itemToDelete));

    c.checks = d;

    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  const removeEmail = (incoming, index) => {
    let c = myConditions[index];
    const { destination, email } = incoming;

    c.mails.default[destination] = c.mails.default[destination].filter(
      item => item != email
    );

    setMyConditions(myConditions);
    setCount(state => state + 2);
  };

  return (
    <Box pad="small">
      <Heading tag="h2" strong align="center">
        When Published {count}
      </Heading>
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

NotificationWizard.propTypes = {};

export default NotificationWizard;
