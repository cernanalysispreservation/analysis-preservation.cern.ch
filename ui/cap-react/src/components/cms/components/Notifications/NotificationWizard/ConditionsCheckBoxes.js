import React from "react";
import PropTypes from "prop-types";
import Tag from "../../../../partials/Tag";
import Button from "../../../../partials/Button";
import { Box } from "grommet";
import Select, { components } from "react-select";
import { groupedOptions } from "./utils/buttonAddOptions";
import "./ConditionsCheckBoxes.css";

const ConditionsCheckBoxes = ({ item, initial }) => {
  if (item.op && item.checks) {
    return item.checks.map((items, index) => (
      <Box key={index} direction="row" align="center">
        <Box
          direction="row"
          align="center"
          separator={items.op && items.checks && "all"}
          pad="small"
          margin={{ horizontal: "small" }}
        >
          <ConditionsCheckBoxes item={items} />
        </Box>
        {index !== item.checks.length - 1 && (
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
        )}
        {index === item.checks.length - 1 &&
          !initial && <Button text="add check" primaryOutline size="small" />}
      </Box>
    ));
  }

  return (
    <Box direction="row" responsive={false} separator="all" pad="small">
      <Tag text={item.path} size="large" />
      <Tag text={item.if} size="large" />
      <Tag text={item.value} size="large" />
      <Select
        className="notification-checkbox-select"
        options={groupedOptions}
        components={<components.Group />}
        width="120px"
      />
    </Box>
  );
};

ConditionsCheckBoxes.propTypes = {};

export default ConditionsCheckBoxes;
