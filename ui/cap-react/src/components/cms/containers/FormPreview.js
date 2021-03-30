import { connect } from "react-redux";

import FormPreview from "../components/SchemaWizard/FormPreview";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizardCurrent.present.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(FormPreview);
