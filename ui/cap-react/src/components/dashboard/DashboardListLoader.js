import React from "react";
import { Box, List, ListItem } from "grommet";
import "./DashboardListLoader.css";

const DashboardListLoader = () => {
  return (
    <Box>
      <List>
        {[...Array(5)].map((item, index) => (
          <ListItem key={index} className="listitem_ds-loader-box">
            <Box
              justify="between"
              responsive={false}
              direction="row"
              style={{
                overflow: "visible"
              }}
              flex
            >
              <Box
                margin={{ right: "medium" }}
                style={{ overflow: "visible" }}
                flex
              >
                <Box direction="row">
                  <Box className="ds_box_header" />
                </Box>
                <Box flex={true} style={{ overflow: "visible" }}>
                  <Box className="ds_box_header_large" />
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DashboardListLoader;
