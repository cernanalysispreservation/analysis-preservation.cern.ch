import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Box from "grommet/components/Box";

import ObjectFieldTemplate from "../ObjectFieldTemplate";
import ArrayFieldTemplate from "../ArrayFieldTemplate";
import FieldTemplate from "../FieldTemplate";
import TextWidget from "../TextWidget";
import { _validate } from "../utils/validate";
import Button from "../../../../../../partials/Button";
import { AiOutlinePullRequest } from "react-icons/ai";

const widgets = {
  TextWidget: TextWidget
};
import Form from "react-jsonschema-form";

const DependenciesProperties = ({ path, current, formContext }) => {
  let currentProps = path && current.getIn([...path.schema]).toJS();
  const [displayDependencies, setDisplayDependencies] = useState(false);

  // check whether there are dependencies for this specific path
  // if not then return null, if yes return
  if (!currentProps || formContext.dependencyForm) return null;
  if (!currentProps.dependencies) return null;

  // fetch the key of the dependency
  let dependencySchema = Object.values(currentProps.dependencies)[0];
  let dependencyKey = Object.keys(currentProps.dependencies)[0];

  return (
    <Box>
      <Box
        colorIndex="light-1"
        pad="small"
        direction="row"
        justify="between"
        align="center"
      >
        <Box direction="row" align="center">
          <AiOutlinePullRequest />
          <Box margin={{ left: "small" }}>Dependency : {dependencyKey}</Box>
        </Box>
        <Button
          size="small"
          text={displayDependencies ? "Hide" : "Show"}
          onClick={() => setDisplayDependencies(!displayDependencies)}
        />
      </Box>

      {displayDependencies && (
        <Box>
          <Form
            schema={dependencySchema}
            uiSchema={{}}
            showErrorList={false}
            formData={{}}
            tagName="div"
            noHtml5Validate={true}
            validate={_validate}
            widgets={widgets}
            FieldTemplate={FieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={ArrayFieldTemplate}
            formContext={{
              schema: [...path.schema],
              uiSchema: [...path.uiSchema],
              dependencyForm: true
            }}
          >
            <span />
          </Form>
        </Box>
      )}
    </Box>
  );
};

DependenciesProperties.propTypes = {
  path: PropTypes.array,
  current: PropTypes.object
};

const mapStateToProps = state => ({
  current: state.schemaWizard.getIn(["current", "schema"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependenciesProperties);
