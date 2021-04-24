import React, { useState } from "react";
import PropTypes from "prop-types";

import ReactTooltip from "react-tooltip";

import Anchor from "../partials/Anchor";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";

import List from "grommet/components/List";

import ListPlaceholder from "grommet-addons/components/ListPlaceholder";
import DashboardListLoader from "./DashboardListLoader";

function DashboardList(props) {
  let { header = "", emptyMessage = null, listType, list, ListItem } = props;
  const [activeList, setActiveList] = useState(Object.keys(list).sort()[0]);

  return (
    <Box
      style={{
        width: "100%"
      }}
      size={{ width: { max: "xxlarge", min: "medium" } }}
    >
      <Box>
        <Box
          flex
          direction="row"
          pad="small"
          justify="between"
          responsive={false}
        >
          <Heading
            tag="h5"
            uppercase={true}
            align="start"
            justify="center"
            margin="none"
            truncate={true}
            data-tip={emptyMessage}
          >
            {header}
          </Heading>
          <Box direction="row" responsive={false}>
            {Object.keys(list).map(type => (
              <Box
                key={type}
                margin={{ left: "small" }}
                onClick={() => setActiveList(type)}
              >
                <Label
                  margin="none"
                  size="small"
                  style={{
                    color:
                      activeList == type ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.4)"
                  }}
                  uppercase
                >
                  {type}
                </Label>
              </Box>
            ))}
          </Box>
        </Box>
        <ReactTooltip />
      </Box>

      <Box
        flex={false}
        size={{
          height: "medium",
          width: { max: "xxlarge", min: "medium" }
        }}
        colorIndex="light-1"
      >
        {props.loading ? (
          <DashboardListLoader />
        ) : list[activeList].list.length > 0 ? (
          <Box>
            <List
              id="anchor-no-style"
              data-cy={`${header.replace(/\s/g, "")}-list`}
            >
              {list[activeList].list.map((item, index) => (
                <Anchor
                  style={{ width: "100%" }}
                  key={index}
                  path={
                    listType == "draft"
                      ? `/drafts/${item.id}`
                      : `/published/${item.id}`
                  }
                >
                  <ListItem item={item} />
                </Anchor>
              ))}
            </List>
            {list[activeList].list.length > 4 ? (
              <Box align="center">
                <Anchor
                  path={list[activeList].more}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>. . .</span>
                </Anchor>
              </Box>
            ) : null}
          </Box>
        ) : (
          <Box flex={true} justify="center" align="center">
            <ListPlaceholder
              unfilteredTotal={0}
              pad="large"
              emptyMessage={props.emptyMessage || "No analysis."}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

DashboardList.propTypes = {
  header: PropTypes.string,
  emptyMessage: PropTypes.string,
  listType: PropTypes.string,
  list: PropTypes.object,
  loading: PropTypes.bool,
  ListItem: PropTypes.func
};

export default DashboardList;
