import { connect } from "react-redux";
import PropertyEditor from "../components/SchemaWizard/PropertyEditor";
import {
  addProperty,
  enableCreateMode,
  deleteByPath,
  renameIdByPath
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    path: state.schemaWizard.getIn(["field"]),
    propKeyEditor: state.schemaWizard.get("propKeyEditor")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, key) => dispatch(addProperty(path, key)),
    enableCreateMode: () => dispatch(enableCreateMode()),
    deleteByPath: path => dispatch(deleteByPath(path)),
    renameId: (newName, path) => dispatch(renameIdByPath(newName, path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyEditor);
