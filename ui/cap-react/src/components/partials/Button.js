import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Box from "grommet/components/Box";
import Spinning from "grommet/components/icons/Spinning";

const ButtonWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${props => props.background};
  color: ${props => props.color};
  height: ${props => props.size.height};
  min-width: ${props => props.size.width || "64px"};
  padding: ${props => props.size.padding};
  font-size: ${props => props.size.fontSize};
  line-height: 1.75;
  border-radius: ${props => (props.rounded ? "50%" : "2px")}
  cursor: pointer;
  margin: ${props => props.margin};

  &:hover {
    background: ${props => props.hoverColor};
  }

  &:hover {
    background: ${props => props.hoverBackground};
  }

  ${({ primary }) =>
    primary &&
    css`
      background: #007298;
      color: #ffffff;

      &:hover {
        background: #3388a9;
      }
    `};

  ${({ primaryPublished }) =>
    primaryPublished &&
    css`
      color: #fff;
      background-color: rgba(146, 109, 146, 1);

      &:hover {
        background-color: rgba(146, 109, 146, 0.9);
      }
    `};

  ${({ primaryOutline }) =>
    primaryOutline &&
    css`
      color: #007298;
      background-color: rgba(0, 114, 152, 0.15);

      &:hover {
        background-color: rgba(0, 114, 152, 0.3);
      }
    `};

  ${({ secondary }) =>
    secondary &&
    css`
      border: 1px solid rgba(0, 0, 0, 0.2);
    `};

  ${({ tertiary }) =>
    tertiary &&
    css`
      text-decoration: underline;
    `};

  ${({ critical }) =>
    critical &&
    css`
      background: rgba(179, 53, 52, 1);
      color: #ffffff;
      &:hover {
        background-color: rgba(179, 53, 52, 0.8);
      }
    `};
  ${({ criticalOutline }) =>
    criticalOutline &&
    css`
      color: rgba(179, 53, 52, 1);
      border: 1px solid #e6e6e6;
      &:hover {
        background: rgba(179, 53, 52, 1);
        color: #fff;
      }
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.5);

      cursor: not-allowed;

      &:hover {
        background: #f5f5f5;
      }
    `};
`;

const Button = ({
  text = "",
  primary = false,
  onClick = null,
  secondary = false,
  disabled = false,
  tertiary = false,
  critical = false,
  criticalOutline = false,
  primaryPublished = false,
  primaryOutline = false,
  icon = null,
  background = "#f5f5f5",
  hoverColor = "#e6e6e6",
  color = "#333",
  margin = "",
  loading = false,
  size = "medium",
  reverse = false,
  className = "",
  id = "",
  dataCy = "",
  rounded = false
}) => {
  const getPadFromSize = size => {
    const choices = {
      iconSmall: {
        height: "24px",
        padding: "1px",
        fontSize: "14px",
        width: "24px"
      },
      icon: {
        height: "37px",
        padding: "1px",
        fontSize: "14px",
        width: "37px"
      },
      iconMedium: {
        height: "45px",
        padding: "5px",
        fontSize: "14px",
        width: "45px"
      },
      iconLarge: {
        height: "49px",
        padding: "5px",
        fontSize: "14px",
        width: "49px"
      },
      small: {
        height: "24px",
        padding: "0 7px",
        fontSize: "14px"
      },
      medium: {
        padding: "6px 16px",
        height: "32px",
        fontSize: "16px"
      },
      large: {
        height: "40px",
        padding: "8px 22px",
        fontSize: "16px"
      },
      xlarge: {
        height: "40px",
        padding: "10px 30px",
        fontSize: "16px"
      },
      xxlarge: {
        height: "40px",
        padding: "15px 35px",
        fontSize: "16px"
      }
    };

    return choices[size] || choices["medium"];
  };

  const getLoadingLeft = size => {
    const choices = {
      small: 1,
      medium: 2,
      large: 5,
      xlarge: 5,
      xxlarge: 8
    };

    return choices[size];
  };

  const getOrderFromProps = reverse => {
    const choices = {
      true: (
        <React.Fragment>
          {text}
          {icon && (
            <Box
              margin={{
                left: text ? "small" : null
              }}
            >
              {icon}
            </Box>
          )}
        </React.Fragment>
      ),
      false: (
        <React.Fragment>
          {icon && (
            <Box
              margin={{
                right: text ? "small" : null
              }}
            >
              {icon}
            </Box>
          )}
          {text}
        </React.Fragment>
      )
    };

    return choices[reverse];
  };
  return (
    <ButtonWrapper
      margin={margin}
      size={getPadFromSize(size)}
      onClick={loading || disabled ? null : onClick}
      secondary={secondary}
      disabled={loading ? true : disabled}
      primary={!disabled && primary}
      primaryOutline={!disabled && primaryOutline}
      primaryPublished={!disabled && primaryPublished}
      tertiary={!disabled && tertiary}
      critical={!disabled && critical}
      criticalOutline={!disabled && criticalOutline}
      background={background}
      hoverColor={hoverColor}
      color={color}
      className={className}
      id={id}
      data-cy={dataCy}
      rounded={rounded}
    >
      {loading && (
        <Box style={{ position: "absolute", left: getLoadingLeft(size) }}>
          <Spinning size="xsmall" />
        </Box>
      )}
      {getOrderFromProps(reverse)}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  dataCy: PropTypes.string,
  text: PropTypes.string,
  primary: PropTypes.bool,
  primaryOutline: PropTypes.bool,
  onClick: PropTypes.func,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  tertiary: PropTypes.bool,
  icon: PropTypes.element,
  critical: PropTypes.bool,
  background: PropTypes.string,
  color: PropTypes.string,
  pad: PropTypes.object,
  margin: PropTypes.object,
  loading: PropTypes.bool,
  criticalOutline: PropTypes.bool,
  primaryPublished: PropTypes.bool,
  size: PropTypes.oneOf([
    "small",
    "medium",
    "large",
    "xlarge",
    "xxlarge",
    "icon",
    "iconSmall",
    "iconMedium",
    "iconLarge"
  ]),
  hoverColor: PropTypes.string,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export default Button;
