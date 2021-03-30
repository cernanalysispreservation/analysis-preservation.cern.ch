import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiOutlineUndo, AiOutlineRedo } from "react-icons/ai";
import Button from "../../../../partials/Button";
import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";

const UndoRedo = ({ canRedo, canUndo, onRedo, onUndo }) => {
  return (
    <Box pad="small" direction="small" align="center">
      <Button
        reverse
        onClick={onUndo}
        disabled={!canUndo}
        text="Undo"
        icon={<AiOutlineUndo size={20} />}
        size="small"
      />
      <Button
        reverse
        onClick={onRedo}
        disabled={!canRedo}
        margin="0 10px"
        text="Redo"
        icon={<AiOutlineRedo size={20} />}
        size="small"
      />
    </Box>
  );
};

UndoRedo.propTypes = {
  canRedo: PropTypes.bool,
  canUndo: PropTypes.bool,
  onRedo: PropTypes.func,
  onUndo: PropTypes.func,
  undoCount: PropTypes.number,
  redoCount: PropTypes.number
};

const mapStateToProps = state => {
  return {
    canUndo: state.schemaWizardCurrent.past.length > 1,
    canRedo: state.schemaWizardCurrent.future.length > 0
  };
};

const mapDispatchToProps = dispatch => ({
  onUndo: () => dispatch(UndoActionCreators.undo()),
  onRedo: () => dispatch(UndoActionCreators.redo())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo);
