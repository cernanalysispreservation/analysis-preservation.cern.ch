import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionsCheckBoxes from "./ConditionsCheckBoxes";
import Button from "../../../../partials/Button";
import "./ConditionList.css";
import Tag from "../../../../partials/Tag";

const ConditionList = ({ item, updateConditions, updateOperatorByPath }) => {
  const [isEmailListConfigurable, setIsEmailListConfigurable] = useState(false);
  return (
    <Box
      separator="all"
      direction="row"
      justify="between"
      style={{ position: "relative", minHeight: "165px" }}
    >
      <Box
        align="center"
        pad="small"
        justify="start"
        direction="row"
        className={
          isEmailListConfigurable
            ? "conditionlist-list-email-selected"
            : "conditionlist-list"
        }
      >
        <ConditionsCheckBoxes
          item={item}
          initial
          updateConditions={updateConditions}
          updateOperatorByPath={updateOperatorByPath}
        />

        <Box>
          <Button
            text="add simple"
            size="small"
            margin="0 0 5px 0"
            primaryOutline
            onClick={() =>
              updateConditions({ nested: false, path: ["checks"] })
            }
          />
          <Button
            text="add multiple"
            size="small"
            primaryOutline
            onClick={() => updateConditions({ nested: true, path: ["checks"] })}
          />
        </Box>
      </Box>
      <Box
        justify="center"
        align="center"
        pad="small"
        className={
          isEmailListConfigurable
            ? "conditionlist-email-section-selected"
            : "conditionlist-email-section"
        }
        direction="row"
      >
        <Box>
          <Heading tag="h3">12 emails</Heading>
          <Button
            text={isEmailListConfigurable ? "update" : "configure"}
            primaryOutline
            onClick={() => setIsEmailListConfigurable(state => !state)}
          />
        </Box>
        <Box
          className={
            isEmailListConfigurable
              ? "email-configuration-selected"
              : "email-configuration"
          }
        >
          <Box margin={{ left: "small" }}>
            <Box>TO:</Box>
            <Box margin={{ bottom: "small" }}>
              <Tag text="atlas@cern.ch" />
            </Box>
            <Box>BCC:</Box>
            <Box margin={{ bottom: "small" }}>
              <Tag text="atlas@cern.ch" />
            </Box>
            <Box>CC:</Box>
            <Box>
              <Tag text="atlas@cern.ch" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ConditionList.propTypes = {};

export default ConditionList;
