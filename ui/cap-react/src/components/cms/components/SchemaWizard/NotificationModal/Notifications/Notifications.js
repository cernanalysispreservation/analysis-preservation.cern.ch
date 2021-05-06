import React from "react";
import { Box, Heading } from "grommet";
import NotificationsList from "./NotificationsList";

const Notifications = () => {
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

export default Notifications;
