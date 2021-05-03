import React from "react";
import PropTypes from "prop-types";
import Tag from "../../../../partials/Tag";
import Button from "../../../../partials/Button";
import Menu from "../../../../partials/Menu";
import MenuItem from "../../../../partials/MenuItem";
import { Box } from "grommet";
import "./ConditionsCheckBoxes.css";
import {
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlinePlus
} from "react-icons/ai";

const selectValues = [
  { value: "multiple", label: "multiple" },
  { value: "single", label: "single" }
];

const ConditionsCheckBoxes = ({
  item,
  initial,
  path = [],
  updateConditions,
  index = undefined,
  updateOperatorByPath
}) => {
  path = [...path, index ? { checks: "checks", index } : "checks"];
  if (item.op && item.checks) {
    return item.checks.map((items, index) => (
      <Box
        key={index}
        direction="row"
        align="center"
        style={{ minWidth: "fit-content" }}
        className="conditionlist-checkbox"
      >
        <Box
          direction="row"
          align="center"
          separator={items.op && items.checks && "all"}
          pad="small"
          colorIndex={path.length % 2 === 0 ? "light-1" : "light-2"}
          margin={{ horizontal: "small" }}
        >
          <ConditionsCheckBoxes
            item={items}
            path={path}
            index={index}
            updateConditions={updateConditions}
            updateOperatorByPath={updateOperatorByPath}
          />
        </Box>
        {index !== item.checks.length - 1 && (
          <Box onClick={() => updateOperatorByPath(path)}>
            <Tag
              margin="0 10px"
              text={<b>{item.op}</b>}
              color={{
                bgcolor: "#c41d7f",
                border: "#fff0f6",
                color: "#ffadd2"
              }}
              size="large"
            />
          </Box>
        )}

        {index === item.checks.length - 1 &&
          !initial && (
            <Box>
              <Button
                text="add simple"
                size="small"
                margin="0 0 5px 0"
                primaryOutline
                onClick={() => updateConditions({ nested: false, path: path })}
              />
              <Button
                text="add multiple"
                size="small"
                primaryOutline
                onClick={() => updateConditions({ nested: true, path: path })}
              />
            </Box>
          )}
      </Box>
    ));
  }

  return (
    <Box direction="row" responsive={false} separator="all" pad="small">
      <Tag text={item.path} size="large" />
      <Tag text={item.if} size="large" />
      <Tag text={item.value} size="large" />
    </Box>
  );
};

ConditionsCheckBoxes.propTypes = {};

export default ConditionsCheckBoxes;
