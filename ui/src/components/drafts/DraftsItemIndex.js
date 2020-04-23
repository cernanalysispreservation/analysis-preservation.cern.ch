import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import { Box } from "grommet";

import DraftHeader from "./components/DraftHeader";

import Sidebar from "./components/DepositSidebar";

import PermissionDenied from "../errors/403";

// Actions
import { getDraftByIdAndInitForm } from "../../actions/draftItem";

import DraftsItemNav from "./DraftsItemNav";
import DraftItemTabs from "./DraftItemTabs";

class DraftsItemIndex extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
  }

  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    if (draft_id) {
      this.props.getDraftById(draft_id);
    }
  }

  render() {
    if (this.props.errors && [403, 404].indexOf(this.props.errors.status) > -1)
      return (
        <PermissionDenied
          status={this.props.errors.status}
          message={this.props.errors.message}
        />
      );

    let { draft_id } = this.props.match.params;

    return (
      <Box flex={true} wrap={false} colorIndex="grey-3">
        <DraftHeader formRef={this.formRef} />
        <Box flex={true} direction="row">
          <DraftsItemNav />
          <Box flex={true} direction="row">
            <DraftItemTabs formRef={this.formRef} />
            <Sidebar />
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftsItemIndex.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  recid: PropTypes.string
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemIndex)
);
