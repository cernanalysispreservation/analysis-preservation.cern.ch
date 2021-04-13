import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ShowMore from "../ShowMore";
import CheckBox from "grommet/components/CheckBox";
import Button from "../../partials/Button";
import SubFacet from "./SubFacet/SubFacet";
import { Map } from "immutable";

const FacetItem = ({
  limit,
  items,
  isAggSelected,
  selectedAggs,
  onChange,
  category,
  item
}) => {
  return (
    <ShowMore limit={limit} items={items} item={item} category={category}>
      {({ current, updateShowMore, filter, expanded, countMore }) => (
        <Box>
          {current.map(field => (
            <Box key={String(field.get("key"))}>
              <Box
                size="medium"
                direction="row"
                align="center"
                style={{
                  fontSize: "0.8em"
                }}
              >
                <CheckBox
                  label={`${field.get("key")} ${
                    Map.isMap(field.get("doc_count"))
                      ? `(${field.get("doc_count").get("doc_count")})`
                      : `(${field.get("doc_count")})`
                  }`}
                  key={field.get("key")}
                  name={String(field.get("key"))}
                  checked={
                    isAggSelected(selectedAggs[category], field.get("key"))
                      ? true
                      : false
                  }
                  onChange={onChange(category)}
                />
              </Box>
              <Box
                style={{
                  margin: "5px 0"
                }}
                margin={{
                  left: "small"
                }}
              >
                {isAggSelected(selectedAggs[category], field.get("key")) &&
                  field.keySeq().map((key, index) => {
                    if (key.startsWith("facet_")) {
                      return (
                        <SubFacet
                          key={key + index}
                          type={key}
                          field={field.toJS()}
                          ff={field}
                          isAggSelected={isAggSelected}
                          selectedAggs={selectedAggs}
                          onChange={onChange}
                        />
                      );
                    }
                  })}
              </Box>
            </Box>
          ))}
          <Box align="center">
            {filter ? (
              <Button
                size="small"
                background="#e9e9e9"
                margin="0 0 5px 0"
                text={expanded ? "Show less" : `Show ${countMore} more`}
                onClick={() => {
                  updateShowMore(category);
                }}
              />
            ) : null}
          </Box>
        </Box>
      )}
    </ShowMore>
  );
};

FacetItem.propTypes = {
  category: PropTypes.string,
  isAggSelected: PropTypes.func,
  onChange: PropTypes.func,
  selectedAggs: PropTypes.object,
  items: PropTypes.object,
  limit: PropTypes.number
};

export default FacetItem;
