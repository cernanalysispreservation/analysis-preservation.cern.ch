import { connect } from "react-redux";

import SchemaWizardHeader from "../components/SchemaWizard/SchemaWizardHeader";
import { withRouter } from "react-router-dom";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizardCurrent.present.getIn(["current", "uiSchema"]),
    initialSchema: state.schemaWizard.getIn(["initial", "schema"]),
    initialUiSchema: state.schemaWizard.getIn(["initial", "uiSchema"]),
    config: state.schemaWizard.get("config")
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
