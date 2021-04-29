import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import CleanForm from "../../../drafts/form/CleanForm";
import { Box } from "grommet";
import Schema from "../utils/configSchema.json";

const SchemaConfig = ({ show, onClose }) => {
  return (
    show && (
      <Modal onClose={onClose} title="Schema Config" separator>
        <Box size="xxlarge" pad="large">
          <CleanForm schema={Schema.deposit_schema}>
            <span />
          </CleanForm>
        </Box>
      </Modal>
    )
  );
};

SchemaConfig.propTypes = {};

export default SchemaConfig;
