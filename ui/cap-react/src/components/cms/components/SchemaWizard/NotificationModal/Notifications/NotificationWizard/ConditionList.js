import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import ConditionsCheckBoxes from "./ConditionsCheckBoxes";
import Button from "../../../../../../partials/Button";
import EditableField from "../../../../../../partials/EditableField";
import "./ConditionList.css";
import Tag from "../../../../../../partials/Tag";

import { AiOutlineClose } from "react-icons/ai";

const ConditionList = ({
  item,
  updateConditions,
  updateOperatorByPath,
  updateEmailList,
  deleteByPath,
  removeEmail
}) => {
  const [isEmailListConfigurable, setIsEmailListConfigurable] = useState(false);

  const getEmailCount = () => {
    let emails = item.getIn(["mails", "default"]);
    let count = 0;
    emails.mapEntries(v => {
      count += v[1].size;
    });

    return `${count} emails`;
  };

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
          deleteByPath={deleteByPath}
        />

        <Box style={{ minWidth: "85px" }}>
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
          <Heading tag="h3"> {getEmailCount()}</Heading>
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
            {item
              .getIn(["mails", "default"])
              .entrySeq()
              .reverse()
              .map(entry => {
                return (
                  <Box key={entry[0]}>
                    <Heading tag="h6" margin="none">
                      {entry[0].toUpperCase()} :
                    </Heading>
                    <Box
                      direction="row"
                      align="center"
                      style={{ marginBottom: "8px" }}
                    >
                      <Box margin={{ right: "small" }}>
                        <EditableField
                          colorIndex="light-1"
                          emptyValue="add email"
                          onUpdate={email =>
                            updateEmailList({
                              destination: entry[0],
                              email: email
                            })
                          }
                        />
                      </Box>
                      <Box direction="row" wrap align="center">
                        {entry[1].map((mail, index) => (
                          <Box key={mail} style={{ position: "relative" }}>
                            <Tag text={mail} margin="0 10px 0 0" />
                            <Box
                              style={{
                                position: "absolute",
                                right: 0,
                                top: -20
                              }}
                            >
                              <Button
                                icon={<AiOutlineClose size={12} />}
                                size="iconSmall"
                                criticalOutline
                                rounded
                                onClick={() =>
                                  removeEmail({
                                    destination: entry[0],
                                    email: mail,
                                    index
                                  })
                                }
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ConditionList.propTypes = {
  item: PropTypes.object,
  updateConditions: PropTypes.func,
  updateOperatorByPath: PropTypes.func,
  updateEmailList: PropTypes.func,
  deleteByPath: PropTypes.func,
  removeEmail: PropTypes.func
};

export default ConditionList;
