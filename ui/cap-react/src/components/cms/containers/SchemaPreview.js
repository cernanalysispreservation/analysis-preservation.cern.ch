import { connect } from "react-redux";

import SchemaPreview from "../components/SchemaWizard/SchemaPreview";
import { selectProperty } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizardCurrent.present.getIn(["current", "uiSchema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectProperty: path => dispatch(selectProperty(path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaPreview);
