import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import NotificationBox from "./NotificationBox";

const myList = [
  {
    title: "review",
    conditions: 15,
    emails: 23
  },
  {
    title: "publish",
    conditions: 3,
    emails: 12
  },
  {
    title: "edit"
  }
];

const NotificationsList = ({ updateSelectedAction, notifications }) => {
  let list = Object.entries(notifications);
  console.log("====================================");
  console.log(list);
  console.log("====================================");
  return (
    <Box
      margin={{ top: "medium" }}
      pad="small"
      style={{
        display: "grid",
        gridGap: "2rem",
        gridTemplateColumns: "repeat(3,1fr)"
      }}
    >
      {Object.entries(notifications).map((item, index) => (
        <NotificationBox
          key={item[0]}
          item={item}
          index={index + 1}
          updateSelectedAction={updateSelectedAction}
        />
      ))}
    </Box>
  );
};

NotificationsList.propTypes = {
  updateSelectedAction: PropTypes.func
};

export default NotificationsList;
