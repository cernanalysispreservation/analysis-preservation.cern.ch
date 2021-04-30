import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import Button from "../../../../partials/Button";
import ConditionsCheckBoxes from "./ConditionsCheckBoxes";

const ConditionList = ({ item, updateConditions, updateOperatorByPath }) => {
  return (
    <Box
      separator="all"
      align="center"
      pad="small"
      justify="start"
      direction="row"
    >
      <ConditionsCheckBoxes
        item={item}
        initial
        updateConditions={updateConditions}
        updateOperatorByPath={updateOperatorByPath}
      />
      <Button
        primaryOutline
        text="add check"
        size="small"
        margin="0 0 0 10px"
        onClick={() => updateConditions(["checks"])}
      />
    </Box>
  );
};

ConditionList.propTypes = {};

export default ConditionList;
