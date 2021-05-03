import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionList from "./ConditionList";

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

    path.map((item, index) => {
      if (!item.index) {
        c = c.checks;
      } else {
        if (index === path.length - 1) c = c[item.index];
        else c = c[item.index].checks;
      }
    });
    c.op = c.op === "and" ? "or" : "and";
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
          <Heading tag="h4" strong margin="none">
            #{index + 1} Condition
          </Heading>
          <ConditionList
            item={item}
            updateConditions={path => updateConditions(path, index)}
            updateOperatorByPath={path => updateOperatorByPath(path, index)}
          />
        </Box>
      ))}
    </Box>
  );
};

NotificationWizard.propTypes = {};

export default NotificationWizard;
