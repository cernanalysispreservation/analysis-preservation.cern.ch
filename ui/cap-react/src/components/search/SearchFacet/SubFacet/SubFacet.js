import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import CheckBox from "grommet/components/CheckBox";
import { Map } from "immutable";

const SubFacet = ({
  type,
  field,
  ff,
  isAggSelected,
  selectedAggs,
  onChange
}) => {
  if (type === "facet_type_version") {
    return ff.getIn([type, "buckets"]).map(nested_field => (
      <Box
        size="medium"
        key={String(nested_field.get("key"))}
        direction="row"
        align="start"
        margin={{ left: "medium" }}
        style={{
          fontSize: "0.8em"
        }}
      >
        <CheckBox
          label={`${nested_field.get("key")} ${
            Map.isMap(nested_field.get("doc_count"))
              ? `(${nested_field.getIn(["doc_count", "doc_count"])})`
              : `(${nested_field.get("doc_count")})`
          }`}
          key={`${ff.get("key")}-${nested_field.get("key")}`}
          name={`${ff.get("key")}-${nested_field.get("key")}`}
          checked={
            isAggSelected(
              selectedAggs[type.replace("facet_", "")],
              `${ff.get("key")}-${nested_field.get("key")}`
            )
              ? true
              : false
          }
          onChange={onChange(type.replace("facet_", ""))}
        />
      </Box>
    ));
  }

  return ff.getIn([type, "buckets"]).map(nested_field => (
    <Box
      size="medium"
      key={String(nested_field.get("key"))}
      direction="row"
      align="start"
      margin={{ left: "medium" }}
      style={{
        fontSize: "0.8em"
      }}
    >
      <CheckBox
        label={nested_field.get("key")}
        key={nested_field.get("key")}
        name={String(nested_field.get("key"))}
        checked={
          isAggSelected(
            selectedAggs[type.replace("facet_", "")],
            nested_field.get("key")
          )
            ? true
            : false
        }
        onChange={onChange(type.replace("facet_", ""))}
      />
      <Box align="end">
        {Map.isMap(nested_field.get("doc_count"))
          ? nested_field.getIn(["doc_count", "doc_count"])
          : nested_field.get("doc_count")}
      </Box>
    </Box>
  ));
};

SubFacet.propTypes = {
  isAggSelected: PropTypes.func,
  onChange: PropTypes.func,
  selectedAggs: PropTypes.object,
  field: PropTypes.object,
  type: PropTypes.string
};

export default SubFacet;
