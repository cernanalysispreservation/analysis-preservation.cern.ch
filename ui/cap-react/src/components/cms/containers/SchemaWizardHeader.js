import { connect } from "react-redux";

import SchemaWizardHeader from "../components/SchemaWizard/SchemaWizardHeader";
import { withRouter } from "react-router-dom";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"]),
    initialSchema: state.schemaWizard.getIn(["initial", "schema"]),
    initialUiSchema: state.schemaWizard.getIn(["initial", "uiSchema"]),
    config: state.schemaWizard.get("config"),
    schemaConfig: state.schemaWizard.get("schemaConfig")
  };
}

function mapDispatchToProps() {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SchemaWizardHeader)
);
