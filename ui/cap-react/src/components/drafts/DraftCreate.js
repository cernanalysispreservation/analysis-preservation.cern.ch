import React from "react";

import Modal from "../partials/Modal";

import CreateForm from "./components/CreateForm";

import PropTypes from "prop-types";

class DraftCreate extends React.Component {
  render() {
    return (
      <Modal onClose={this.props.toggle} title="Create Analysis">
        <CreateForm />
      </Modal>
    );
  }
}

DraftCreate.propTypes = {
  contentTypes: PropTypes.object,
  toggle: PropTypes.func,
  formData: PropTypes.object,
  metadata: PropTypes.object
};

export default DraftCreate;
