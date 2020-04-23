import styled from "styled-components";
import { styled as themeStyled } from "react-tabtab";

let { TabListStyle, ActionButtonStyle, TabStyle, PanelStyle } = themeStyled;

TabListStyle = styled(TabListStyle)`
  background-color: transparent;
  // box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
  border: 0;
`;

TabStyle = styled(TabStyle)`
  color: rgba(238, 110, 115, 0.7);
  transition: color 0.28s ease;
  background-color: #eee;
  padding: 2px;
  border: 0.2px solid #666;

  svg {
    height: 10px !important;
    width: 12px !important;
  }
  ${props =>
    props.active
      ? `
      border-top: 2px solid #006996;
      border-bottom-color: #fff;
      background-color: #fff;
    `
      : null} &:hover {
    background-color: #fff;
    color: #ee6e73;
  }
`;

ActionButtonStyle = styled(ActionButtonStyle)`
  background-color: transparent;
  border-radius: 0;
  &:hover {
    background-color: #eee;
  }
`;

PanelStyle = styled(PanelStyle)`
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 30px 30px;
  transition: box-shadow 0.25s, -webkit-box-shadow 0.25s;
  border-radius: 2px;
`;

export default {
  TabList: TabListStyle,
  ActionButton: ActionButtonStyle,
  Tab: TabStyle,
  Panel: PanelStyle
};
