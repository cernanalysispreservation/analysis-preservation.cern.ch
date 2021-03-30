import React from "react";
import { connect } from "react-redux";

import Box from "grommet/components/Box";

import { PropTypes } from "prop-types";
import { selectProperty } from "../../../../../../actions/schemaWizard";
import {
  AiOutlineUp,
  AiOutlineDown,
  AiOutlineCloudDownload,
  AiOutlineBorderTop,
  AiOutlineContainer,
  AiOutlineFile,
  AiOutlinePullRequest
} from "react-icons/ai";

import {
  BsType,
  BsCheckBox,
  BsToggleOff,
  BsListOl,
  BsCircle,
  BsBraces,
  BsHash,
  BsGrid,
  BsTag
} from "react-icons/bs";

class SchemaTreeItem extends React.Component {
  constructor(props) {
    super(props);
  }

  // selects the item for the property editor
  _onClick = () => {
    this.props.selectProperty(this.props.path);
  };

  shouldBoxAcceptChildren = uiSchema => {
    return uiSchema["ui:field"] !== undefined;
  };

  getIconByType = (uiSchema = {}, schema = {}) => {
    let type;
    // in case we can not define the type of the element from the uiSchema,
    // extract the type from the schema
    if (
      !uiSchema ||
      (!uiSchema["ui:widget"] &&
        !uiSchema["ui:field"] &&
        !uiSchema["ui:object"])
    ) {
      type = schema.type === "string" ? "text" : schema.type;
    } else {
      if (uiSchema["ui:widget"]) {
        type = uiSchema["ui:widget"];
      }
      if (uiSchema["ui:field"]) {
        type = uiSchema["ui:field"];
        if (
          uiSchema["ui:field"] === "idFetcher" &&
          uiSchema["ui:servicesList"].length < 3
        ) {
          type = uiSchema["ui:servicesList"][0].value;
        }
      }
      if (uiSchema["ui:object"]) {
        type = uiSchema["ui:object"];
      }
    }

    return mapType2Icon[type];
  };

  render() {
    return (
      <div
        style={{
          borderBottom: "2px solid #64727d",
          opacity:
            this.props.uiSchema &&
            this.props.uiSchema["ui:options"] &&
            this.props.uiSchema["ui:options"].hidden &&
            0.5
        }}
      >
        <Box
          colorIndex={this.props.colorIndex || "light-2"}
          separator="all"
          pad={{ horizontal: "small" }}
          direction="row"
          align="center"
          justify="between"
          wrap={false}
        >
          {this.props.schema ? (
            <Box
              onClick={this._onClick.bind(this)}
              direction="row"
              align="center"
            >
              {this.getIconByType(this.props.uiSchema, this.props.schema)}
              <Box flex={false} pad={{ horizontal: "small" }} align="start">
                <div
                  style={{
                    width: "185px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left"
                  }}
                >
                  {this.props.schema.title || "Untitled field"}
                </div>
                <div
                  style={{
                    padding: "0 3px",
                    marginBottom: "4px",
                    backgroundColor: "#e6e6e6",
                    fontSize: "11px"
                  }}
                >
                  {this.props.path.schema[this.props.path.schema.length - 1]}
                </div>
              </Box>
            </Box>
          ) : null}
          {this.props.schema ? (
            <Box direction="row" align="center" wrap={false} flex={false}>
              {this.props.current &&
                this.props.path &&
                this.props.current.getIn([...this.props.path.schema]).toJS()
                  .dependencies && <AiOutlinePullRequest />}
              {this.props.schema.type == "object" &&
              !this.shouldBoxAcceptChildren(this.props.uiSchema) ? (
                <Box
                  direction="row"
                  responsive={false}
                  onClick={this.props.updateDisplay}
                  align="center"
                >
                  {this.props.display ? <AiOutlineUp /> : <AiOutlineDown />}
                </Box>
              ) : null}
              {this.props.schema.type == "array" ? (
                <Box
                  direction="row"
                  responsive={false}
                  onClick={this.props.updateDisplay}
                  align="center"
                >
                  {this.props.display ? <AiOutlineUp /> : <AiOutlineDown />}
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Box>
      </div>
    );
  }
}

SchemaTreeItem.propTypes = {
  schema: PropTypes.object,
  id: PropTypes.string,
  path: PropTypes.array,
  selectProperty: PropTypes.func,
  addProperty: PropTypes.func,
  addItem: PropTypes.func,
  type: PropTypes.string,
  colorIndex: PropTypes.string,
  display: PropTypes.bool,
  updateDisplay: PropTypes.func,
  uiSchema: PropTypes.object,
  current: PropTypes.object
};

const mapStateToProps = state => ({
  current: state.schemaWizard.getIn(["current", "schema"])
});

function mapDispatchToProps(dispatch) {
  return {
    selectProperty: path => dispatch(selectProperty(path))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaTreeItem);

let mapType2Icon = {
  object: <BsBraces size={20} />,
  array: <BsListOl size={20} />,
  select: <BsGrid size={20} />,
  boolean: <Box>1|0</Box>,
  text: <BsType size={20} />,
  number: <BsHash size={20} />,
  integer: <BsHash size={20} />,
  checkboxes: <BsCheckBox size={20} />,
  radio: <BsCircle size={20} />,
  switch: <BsToggleOff size={20} />,
  textarea: <AiOutlineContainer size={20} />,
  CapFiles: <AiOutlineFile size={20} />,
  tags: <BsTag size={20} />,
  idFetcher: <AiOutlineCloudDownload size={20} />,
  ror: <AiOutlineCloudDownload size={20} />,
  zenodo: <AiOutlineCloudDownload size={20} />,
  orcid: <AiOutlineCloudDownload size={20} />,
  accordionObjectField: <AiOutlineBorderTop size={20} />
};
