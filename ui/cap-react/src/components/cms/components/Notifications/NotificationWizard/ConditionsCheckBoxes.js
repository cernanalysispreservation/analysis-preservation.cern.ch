import React from "react";
import PropTypes from "prop-types";
import Tag from "../../../../partials/Tag";
import Button from "../../../../partials/Button";
import { Box } from "grommet";
import "./ConditionsCheckBoxes.css";

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
      <Box key={index} direction="row" align="center">
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
            <Button
              text="add check"
              primaryOutline
              size="small"
              onClick={() => updateConditions(path)}
            />
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
