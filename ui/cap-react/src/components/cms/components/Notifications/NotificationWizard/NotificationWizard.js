import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionList from "./ConditionList";

const conditions = [
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
            path: "some_field",
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
  return (
    <Box pad="small">
      <Heading tag="h2" strong align="center">
        When Published
      </Heading>
      {conditions.map((item, index) => (
        <Box margin={{ vertical: "small" }} key={index}>
          <Heading tag="h4" strong margin="none">
            #{index + 1} Condition
          </Heading>
          <ConditionList item={item} />
        </Box>
      ))}
    </Box>
  );
};

NotificationWizard.propTypes = {};

export default NotificationWizard;
