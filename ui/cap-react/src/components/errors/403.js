import React from "react";
import Box from "grommet/components/Box";
import Label from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import { withRouter } from "react-router";
import Button from "../partials/Button";
import PropTypes from "prop-types";

const PermissionDenied = ({ history, status = 404, message }) => {
  const getTitle = () => {
    const choices = {
      403: "Permission Required",
      404: "Page was not Found",
      500: "Network Error"
    };

    return choices[status];
  };

  const getMessage = () => {
    const choices = {
      404: (
        <span>
          The page your are looking for, either was removed <br /> or<br /> the
          url path is not correct
        </span>
      ),
      403: (
        <span>
          Your account has not the permissions to access the content of this
          page
        </span>
      ),
      500: (
        <span>
          Currently our service can not provide any information due to a problem. Please try again later
        </span>
      )
    };

    return choices[status];
  };
  return (
    <Box flex colorIndex="light-1" align="center" justify="center">
      <Box style={{ color: "#006A93" }}>
        <Box
          direction="row"
          align="center"
          responsive={false}
          pad="small"
          style={{ letterSpacing: "1px" }}
        >
          <Heading>{status}</Heading>
          <Box
            style={{
              height: "5px",
              width: "20px",
              background: "#006A93",
              margin: "0 20px"
            }}
          />
          <Heading>{getTitle()}</Heading>
        </Box>
        <Box margin={{ top: "medium" }} align="center">
          <Label style={{ textAlign: "center", color: "#006a93", opacity: 1 }}>
            {message ? message : getMessage()}
          </Label>
        </Box>
        <Box
          direction="row"
          responsive={false}
          justify="between"
          margin={{ top: "large" }}
          pad="medium"
        >
          <Button text="Previous" secondary onClick={() => history.goBack()} />
          <Button text="Home" primary onClick={() => history.push("/")} />
        </Box>
      </Box>
    </Box>
  );
};

PermissionDenied.propTypes = {
  status: PropTypes.number,
  message: PropTypes.string,
  statusText: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(PermissionDenied);
