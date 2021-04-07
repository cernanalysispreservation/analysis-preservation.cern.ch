import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Truncate from "react-truncate";
import TimeAgo from "react-timeago";
import { AiOutlineLink, AiOutlineMail } from "react-icons/ai";

import Box from "grommet/components/Box";

import Anchor from "../partials/Anchor";
import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Tag from "../partials/Tag";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const timeOptions = {
      day: "numeric",
      month: "long",
      year: "numeric"
    };
    return this.props.results.size > 0 ? (
      <Box colorIndex="light-2">
        <List className="search_result_box">
          {this.props.results.map((item, index) => {
            return (
              <ListItem
                key={`${item.get("id")}-${index}`}
                separator="none"
                pad="none"
              >
                <Box
                  colorIndex="light-1"
                  margin={{ vertical: "small" }}
                  style={{ width: "100%", borderRadius: "2px" }}
                  pad="small"
                >
                  <Box
                    direction="row"
                    align="center"
                    justify="between"
                    responsive={false}
                  >
                    <Box direction="row" flex responsive={false}>
                      <Anchor
                        path={
                          status === "published"
                            ? `/published/${item.get("id")}`
                            : `/drafts/${item.get("id")}`
                        }
                        style={{ textDecoration: "none", color: "#666" }}
                        reverse
                        pad="none"
                      >
                        <Label
                          margin="none"
                          size="medium"
                          style={{ color: "rgb(0,0,0)" }}
                        >
                          {item.hasIn(["metadata", "general_title"]) &&
                          item.getIn(["metadata", "general_title"]).trim() !==
                            ""
                            ? item.getIn(["metadata", "general_title"])
                            : "No title provided"}
                        </Label>
                        <AiOutlineLink
                          size="18px"
                          style={{
                            color: "rgba(0,0,0,0.5)",
                            marginLeft: "5px"
                          }}
                        />
                      </Anchor>
                    </Box>

                    {/* <Label
                      margin="none"
                      size="small"
                      style={{ color: "rgba(0,0,0,0.3)" }}
                    >
                      {labels.map((item, index) => (
                        <span key={index}> {item}</span>
                      ))}
                    </Label> */}
                  </Box>
                  <Box>
                    <Label margin="none" size="small">
                      {new Date(item.get("created")).toLocaleString(
                        "en-GB",
                        timeOptions
                      )}
                    </Label>
                    <Box
                      flex={false}
                      direction="row"
                      wrap
                      margin={{ top: "small" }}
                      responsive={false}
                    >
                      {item.has("labels") &&
                        item.get("labels").map((item, index) => {
                          return (
                            <Box
                              key={index}
                              style={{ margin: "2px 4px 2px 0" }}
                            >
                              <Tag text={item} />
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>

                  {item.hasIn(["metadata", "basic_info", "abstract"]) && (
                    <Box margin={{ top: "small" }}>
                      <Truncate lines={2} ellipsis={<span>...</span>}>
                        {item.getIn(["metadata", "basic_info", "abstract"])}
                      </Truncate>
                    </Box>
                  )}
                  <Box
                    direction="row"
                    style={{ color: "rgba(0,0,0,0.3)", marginTop: "5px" }}
                    justify="between"
                    responsive={false}
                  >
                    <Box
                      direction="row"
                      align="center"
                      justify="center"
                      responsive={false}
                    >
                      {item.has("created_by") && (
                        <React.Fragment>
                          <AiOutlineMail size="14px" />
                          <Label
                            margin="none"
                            size="small"
                            style={{
                              color: "rgba(0,0,0,0.5)",
                              marginLeft: "5px"
                            }}
                          >
                            {item.getIn(["created_by", "email"])}
                          </Label>
                        </React.Fragment>
                      )}
                    </Box>
                    <Box>
                      <Label
                        margin="none"
                        size="small"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        {item.has("updated") && (
                          <React.Fragment>
                            Updated{" "}
                            <TimeAgo
                              date={item.get("updated")}
                              minPeriod="60"
                            />
                          </React.Fragment>
                        )}
                      </Label>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    ) : null;
  }
}

SearchResults.propTypes = {
  results: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.string,
  size: PropTypes.string,
  user_id: PropTypes.number
};

function mapStateToProps(state) {
  return {
    user_id: state.auth.getIn(["currentUser", "userId"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchResults));
