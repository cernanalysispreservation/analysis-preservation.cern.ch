import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import {
  AiOutlineWarning,
  AiOutlineCloseCircle,
  AiOutlineCheck,
  AiOutlineNotification
} from "react-icons/ai";
import Box from "grommet/components/Box";

const Wrapper = styled.div`
  background: ${props => props.background};
  border-radius: 3px;
  padding: ${props => props.padding};
  display: flex;
  align-items: center;

  ${({ type }) =>
    type === "error" &&
    css`
      background: #ffebee;
    `};
  ${({ type }) =>
    type === "warning" &&
    css`
      background: rgb(254, 247, 225);
    `};
  ${({ type }) =>
    type === "success" &&
    css`
      background: #e6ffed;
    `};
  ${({ type }) =>
    type === "published" &&
    css`
      background: rgba(194, 165, 194, 1);
    `};
`;

const Text = styled.div`
  padding: 5px;
  margin: 0 3px;
  line-height: 150%;
  letter-spacing: 0.5px;
`;

const getIconByType = type => {
  const choices = {
    error: <AiOutlineCloseCircle size={25} color="#f44336" />,
    warning: <AiOutlineWarning size={25} color="rgb(232,134,34)" />,
    success: <AiOutlineCheck size={25} color="#457352" />
  };

  return choices[type];
};

const Notification = ({
  text,
  type = "",
  background = "#f5f5f5",
  padding = "10px",
  action = null
}) => {
  return (
    <Wrapper type={type} background={background} padding={padding}>
      <Box style={{ padding: "5px" }}>
        {getIconByType(type) ? (
          getIconByType(type)
        ) : (
          <AiOutlineNotification size={25} />
        )}
      </Box>
      <Box flex>
        <Text>{text}</Text>
      </Box>
      <Box justify="center">{action}</Box>
    </Wrapper>
  );
};

Notification.propTypes = {
  text: PropTypes.node,
  type: PropTypes.string,
  padding: PropTypes.string,
  background: PropTypes.string,
  action: PropTypes.element
};

export default Notification;
