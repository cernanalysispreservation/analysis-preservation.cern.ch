import React from "react";
import { Box, Sidebar } from "grommet";
import SectionHeader from "./SectionHeader";
import "../draftLoader.css";
import HorizontalWithText from "../../partials/HorizontalWithText";

const DepositSidebarLoading = () => {
  return (
    <Sidebar
      full={false}
      colorIndex="light-2"
      className="lg-row"
      style={{ height: "100%" }}
    >
      <Box
        flex={false}
        pad="none"
        size={{ width: { min: "medium" } }}
        separator="bottom"
        margin={{ bottom: "medium" }}
      >
        <Box flex={false} pad="small" style={{ fontWeight: "100" }}>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            wrap={false}
          >
            ID
            <Box className="deposit_header loader_box" />
          </Box>

          <Box
            direction="row"
            wrap={false}
            justify="between"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            <span>Collection</span>
            <Box className="deposit_header loader_box" />
          </Box>

          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
            data-cy="deposit-status-tag"
          >
            <span>Status</span>
            <Box className="deposit_header loader_box" />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Creator
            <Box className="deposit_header loader_box" />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Created
            <Box className="deposit_header loader_box" />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Last Updated
            <Box className="deposit_header loader_box" />
          </Box>
        </Box>
      </Box>
      <Box flex={true} pad="none" colorIndex="light-2">
        <SectionHeader label="Files | Data | Repos" uppercase={true} />
        <HorizontalWithText
          text="All Files"
          background={"#f5f5f5"}
          color={"#000"}
        />
        <Box align="center" style={{ marginTop: "5px" }}>
          <Box className="deposit_row loader_box" />
          <Box className="deposit_row loader_box" />
        </Box>
        <HorizontalWithText
          text="All Repositories"
          background={"#f5f5f5"}
          color={"#000"}
        />
        <Box align="center" style={{ marginTop: "5px" }}>
          <Box className="deposit_row loader_box" />
          <Box className="deposit_row loader_box" />
        </Box>
      </Box>
    </Sidebar>
  );
};

DepositSidebarLoading.propTypes = {};

export default DepositSidebarLoading;
