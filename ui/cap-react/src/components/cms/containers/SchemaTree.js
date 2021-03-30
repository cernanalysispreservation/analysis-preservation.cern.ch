import { connect } from "react-redux";

import SchemaTree from "../components/SchemaWizard/SchemaPreview/SchemaTree";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizardCurrent.present.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(SchemaTree);
