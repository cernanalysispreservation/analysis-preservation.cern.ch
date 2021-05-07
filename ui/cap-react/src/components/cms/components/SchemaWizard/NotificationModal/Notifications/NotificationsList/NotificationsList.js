import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import NotificationBox from "./NotificationBox";

const NotificationsList = ({ updateSelectedAction, notifications }) => {
  return (
    <Box
      margin={{ top: "medium" }}
      pad="small"
      style={{
        display: "grid",
        gridGap: "2rem",
        gridTemplateColumns: "repeat(auto-fill,minmax(400px,450px))",
        justifyContent: "center"
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
