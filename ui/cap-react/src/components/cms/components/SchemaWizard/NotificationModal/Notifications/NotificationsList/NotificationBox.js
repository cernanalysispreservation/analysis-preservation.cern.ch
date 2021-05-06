import React from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import Button from "../../../../../../partials/Button";
import { BsArrowRight } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

const NotificationBox = ({ item, index, updateSelectedAction }) => {
  return (
    <Box
      colorIndex="light-2"
      margin={{ horizontal: "small" }}
      pad="small"
      style={{ height: "180px", width: "80%", borderRadius: "3px" }}
    >
      <Box direction="row" responsive={false} align="center" justify="between">
        <Heading tag="h3" strong>
          {item.title}
        </Heading>
        <Heading tag="h4" style={{ color: "rgba(0,0,0,0.3)" }}>
          #{index}
        </Heading>
      </Box>
      {!item.conditions && !item.emails ? (
        <Box
          align="center"
          justify="center"
          pad={{ horizontal: "small" }}
          margin={{ top: "small" }}
          flex
        >
          <Heading tag="h4" align="center">
            You can now create conditions and send emails when{" "}
            <strong>{item.title} </strong>
            event takes place
          </Heading>
          <Button
            text="create conditions"
            icon={<AiOutlinePlus />}
            primaryOutline
            onClick={() => updateSelectedAction(item.title)}
          />
        </Box>
      ) : (
        <React.Fragment>
          <Box
            direction="row"
            responsive={false}
            align="center"
            justify="between"
            pad={{ horizontal: "small" }}
          >
            <Box>
              <Heading tag="h4" strong margin="none">
                conditions
              </Heading>
              <Heading tag="h2" margin="none">
                {item.conditions}
              </Heading>
            </Box>
            <Box align="end">
              <Heading tag="h4" strong margin="none">
                emails
              </Heading>
              <Heading tag="h2" margin="none">
                {item.emails}
              </Heading>
            </Box>
          </Box>
          <Box
            direction="row"
            align="center"
            justify="center"
            pad={{ horizontal: "small" }}
            margin={{ top: "small" }}
          >
            <Button
              text="See more"
              icon={<BsArrowRight />}
              reverse
              primaryOutline
              onClick={() => updateSelectedAction(item.title)}
            />
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

NotificationBox.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  updateSelectedAction: PropTypes.func
};

export default NotificationBox;
