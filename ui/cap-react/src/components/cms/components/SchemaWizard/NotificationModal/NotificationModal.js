import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../partials/Modal";
import Box from "grommet/components/Box";
import NotificationList from "./Notifications/NotificationsList";
import NotificationWizard from "./Notifications/NotificationWizard";

const NotificationModal = ({ onClose, updateSchemaConfig, schemaConfig }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <Box>
      <Modal
        onClose={onClose}
        title="Notification Configuration"
        separator
        full
        position="left"
        animated
      >
        <Box style={{ width: "1500px" }}>
          {selectedAction ? (
            <NotificationWizard
              action={selectedAction}
              updateSelectedAction={() => setSelectedAction(null)}
              notifications={schemaConfig.toJS().notifications.actions}
              updateSchemaConfig={updateSchemaConfig}
            />
          ) : (
            <NotificationList
              notifications={schemaConfig.toJS().notifications.actions}
              updateSelectedAction={action => setSelectedAction(action)}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

NotificationModal.propTypes = {
  onClose: PropTypes.func
};

export default NotificationModal;
