import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";
import { getSchema } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    current: state.schemaWizardCurrent.present.get("current"),
    field: state.schemaWizard.get("field"),
    loader: state.schemaWizard.get("loader"),
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSchema: (name, version) => dispatch(getSchema(name, version))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaWizard);
