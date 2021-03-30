import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";

import SchemaTree from "../../../containers/SchemaTree";

class SchemaPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: "tree" };
  }

  render() {
    return (
      <Box flex justify="between" colorIndex="grey-3">
        <Box flex={true}>
          <Box
            key="root"
            onClick={() =>
              this.props.selectProperty({ schema: [], uiSchema: [] })
            }
          >
            <Box
              pad="small"
              style={{
                width: "100%",
                borderBottom: "1px solid black",
                fontSize: "1.3m"
              }}
            >
              {(this.props.schema && this.props.schema.get("title")) || "Root"}
            </Box>
          </Box>
          <SchemaTree key="schemaTree" />
        </Box>
      </Box>
    );
  }
}

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  selectProperty: PropTypes.func
};

export default SchemaPreview;
