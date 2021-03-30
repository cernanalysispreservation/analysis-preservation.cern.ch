import { connect } from "react-redux";
import ContentTypeDetails from "../components/SchemaWizard/ContentTypeDetails";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizardCurrent.present.getIn(["current", "schema"]),
    path: state.schemaWizard.getIn(["field", "path"])
  };
}

export default connect(mapStateToProps)(ContentTypeDetails);
