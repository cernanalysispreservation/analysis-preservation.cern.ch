import React from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";

const TextWidget = props => {
  const { formContext, rawErrors = [{}] } = props;

  let path = {
    schema: [...formContext.schema, ...(rawErrors[0].schema || [])],
    uiSchema: [...formContext.uiSchema, ...(rawErrors[0].uiSchema || [])]
  };

  return <SchemaTreeItem type="array" {...props} path={path} />;
};

TextWidget.propTypes = {
  formContext: PropTypes.object,
  rawErrors: PropTypes.array
};

export default TextWidget;
