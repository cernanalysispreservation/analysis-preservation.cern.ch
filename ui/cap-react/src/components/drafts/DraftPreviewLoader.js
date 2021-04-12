import React from "react";
import { Box } from "grommet";
import "./draftLoader.css";

const DraftPreviewLoader = () => {
  return (
    <Box
      flex={true}
      direction="row"
      wrap={true}
      align="start"
      justify="center"
      colorIndex="light-1"
    >
      <Box
        flex={true}
        direction="column"
        style={{ width: "100%", maxWidth: "960px" }}
      >
        <Box pad={{ horizontal: "medium" }}>
          <Box
            direction="row"
            responsive={false}
            justify="between"
            pad={{ horizontal: "medium" }}
            margin={{ vertical: "small" }}
            style={{ borderRadius: "3px" }}
            separator="all"
            className="info_header_box"
            align="center"
          >
            <Box className="section_header_xs loader_box" />
            <Box className="section_header_xs loader_box" />
            <Box className="section_header_xs loader_box" />
            <Box className="section_header_xs loader_box" />
            <Box className="section_header_xs loader_box" />
          </Box>
        </Box>
        <Box pad={{ horizontal: "medium", vertical: "medium" }}>
          <Box className="section_header loader_box" />
          <Box
            className="section_box_large"
            separator="all"
            style={{ borderRadius: "3px" }}
            pad="large"
            margin={{ vertical: "small" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
            <Box pad={{ horizontal: "small" }} margin={{ vertical: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
            <Box pad={{ horizontal: "small" }} margin={{ vertical: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
          </Box>
        </Box>
        <Box pad={{ horizontal: "medium" }} margin={{ vertical: "small" }}>
          <Box className="section_header loader_box" />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_small loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
          </Box>
        </Box>
        <Box pad={{ horizontal: "medium" }} margin={{ vertical: "small" }}>
          <Box className="section_header loader_box" />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_small loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
          </Box>
        </Box>
        <Box pad={{ horizontal: "medium" }} margin={{ vertical: "small" }}>
          <Box className="section_header loader_box" />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Box className="section_header loader_box" />
              <Box className="section_header_small loader_box" />
              <Box className="section_header_medium loader_box" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

DraftPreviewLoader.propTypes = {};

export default DraftPreviewLoader;
