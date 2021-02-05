import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ShowMore from "../ShowMore";
import CheckBox from "grommet/components/CheckBox";
import Anchor from "../../partials/Anchor";
import SubFacet from "./SubFacet/SubFacet";

const FacetItem = ({
  limit,
  items,
  isAggSelected,
  selectedAggs,
  onChange,
  category
}) => {
  return (
    <ShowMore limit={limit} items={items}>
      {({ current, showMore, showLess, filter, expanded }) => (
        <Box>
          {current.map(field => (
            <Box key={String(field.key)}>
              <Box
                size="medium"
                direction="row"
                align="center"
                style={{
                  fontSize: "0.8em"
                }}
              >
                <CheckBox
                  label={`${field.key} ${
                    typeof field.doc_count === "object"
                      ? `(${field.doc_count.doc_count})`
                      : `(${field.doc_count})`
                  }`}
                  key={field.key}
                  name={String(field.key)}
                  checked={
                    isAggSelected(selectedAggs[category], field.key)
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
                {isAggSelected(selectedAggs[category], field.key) &&
                  Object.keys(field)
                    .filter(key => key.startsWith("facet_"))
                    .map((key, index) => {
                      return (
                        <SubFacet
                          key={key + index}
                          type={key}
                          field={field}
                          isAggSelected={isAggSelected}
                          selectedAggs={selectedAggs}
                          onChange={onChange}
                        />
                      );
                    })}
              </Box>
            </Box>
          ))}
          <Box align="center">
            {filter ? (
              <Anchor
                label={expanded ? "less" : "more"}
                onClick={() => {
                  expanded ? showLess() : showMore();
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
