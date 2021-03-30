import { connect } from "react-redux";
import CustomizeField from "../components/SchemaWizard/PropertyEditor/customizeField";
import {
  updateSchemaByPath,
  updateUiSchemaByPath,
  enableCreateMode
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  const _path = state.schemaWizard.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.getIn(["field", "uiPath"]);
  if (_path)
    return {
      schema: state.schemaWizardCurrent.present.getIn([
        "current",
        "schema",
        ..._path
      ]),
      uiSchema: state.schemaWizardCurrent.present.getIn([
        "current",
        "uiSchema",
        ..._uiPath
      ]),
      __path: state.schemaWizard.getIn(["field", "path"])
    };
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSchemaChange: (path, schema) =>
      dispatch(updateSchemaByPath(path, schema)),
    onUiSchemaChange: (path, schema) =>
      dispatch(updateUiSchemaByPath(path, schema)),
    enableCreateMode: () => dispatch(enableCreateMode())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizeField);
