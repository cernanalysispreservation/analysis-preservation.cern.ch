import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import NotificationBox from "./NotificationBox";

const myList = [
  {
    title: "Review",
    conditions: 15,
    emails: 23
  },
  {
    title: "Publish",
    conditions: 3,
    emails: 12
  },
  {
    title: "Edit"
  }
];

const NotificationsList = props => {
  return (
    <Box
      margin={{ top: "medium" }}
      pad="small"
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))"
      }}
    >
      {myList.map((item, index) => (
        <NotificationBox key={item.title} item={item} index={index + 1} />
      ))}
    </Box>
  );
};

NotificationsList.propTypes = {};

export default NotificationsList;
