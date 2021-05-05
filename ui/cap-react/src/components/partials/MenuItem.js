import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import styled from "styled-components";
import Anchor from "grommet/components/Anchor";

const Wrapper = styled(Anchor)`
  background: ${props => props.background};
  text-decoration: none;
  font-size: 1rem;
  line-height: 1.5;
  display: flex;

  padding: 0 10px;

  &:hover {
    background: ${props => props.hovered && "rgb(235, 235, 235)"};
    cursor: pointer;
    text-decoration: none;
  }
`;

const Item = styled.span`
  padding: 12px 24px;
  white-space: nowrap;
  color: #666 !important;
  letter-spacing: 0.7px;

  &:hover {
    text-decoration: none !important;
  }
`;

const MenuItem = ({
  title,
  icon = null,
  path = null,
  onClick = null,
  href = "#",
  className = "",
  separator = false,
  hovered = false,
  background = "rgb(255, 255, 255)",
  dataCy = ""
}) => {
  return (
    <div className={className} data-cy={dataCy}>
      <Wrapper
        onClick={onClick}
        href={onClick ? null : href}
        path={path}
        responsive={false}
        hovered={hovered}
        className="not-underline"
        background={background}
        style={{
          paddingLeft: "5px",
          borderBottom: separator ? "0.1px solid rgba(0, 0, 0, 0.1)" : ""
        }}
      >
        <Box justify="center">{icon}</Box>
        <Item>{title}</Item>
      </Wrapper>
    </div>
  );
};

MenuItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  path: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  separator: PropTypes.bool,
  hovered: PropTypes.bool,
  background: PropTypes.string,
  dataCy: PropTypes.string
};

export default MenuItem;
