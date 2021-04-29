import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import NotificationsList from "./NotificationsList";

const Notifications = props => {
  return (
    <Box align="center">
      <Heading tag="h2" strong>
        Schema Notifications
      </Heading>
      <Box size="xlarge">
        <NotificationsList />
      </Box>
    </Box>
  );
};

Notifications.propTypes = {};

export default Notifications;
