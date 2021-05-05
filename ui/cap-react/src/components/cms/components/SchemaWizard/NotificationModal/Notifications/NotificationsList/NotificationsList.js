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

const NotificationsList = ({ updateSelectedAction }) => {
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
      {myList.map((item, index) => (
        <NotificationBox
          key={item.title}
          item={item}
          index={index + 1}
          updateSelectedAction={updateSelectedAction}
        />
      ))}
    </Box>
  );
};

NotificationsList.propTypes = {};

export default NotificationsList;
