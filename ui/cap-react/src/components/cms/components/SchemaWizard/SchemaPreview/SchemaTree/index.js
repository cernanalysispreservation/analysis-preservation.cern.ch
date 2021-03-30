import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Form from "react-jsonschema-form";

import { transformSchema } from "../../../../../drafts/DraftEditor";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import TextWidget from "./TextWidget";
import { _validate } from "./utils/validate";

const widgets = {
  text: TextWidget,
  textarea: TextWidget,
  select: TextWidget
};

class SchemaTree extends React.Component {
  render() {
    return (
      <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Form
          schema={transformSchema(this.props.schema.toJS())}
          uiSchema={this.props.uiSchema.toJS()}
          formData={{}}
          showErrorList={false}
          tagName="div"
          FieldTemplate={FieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          ArrayFieldTemplate={ArrayFieldTemplate}
          liveValidate={true}
          widgets={widgets}
          validate={_validate}
          noHtml5Validate={true}
          formContext={{
            schema: [],
            uiSchema: []
          }}
        >
          <span />
        </Form>
      </Box>
    );
  }
}

SchemaTree.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default SchemaTree;
