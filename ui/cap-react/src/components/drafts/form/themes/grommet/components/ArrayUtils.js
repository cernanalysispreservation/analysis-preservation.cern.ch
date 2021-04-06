import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Button from "../../../../../partials/Button";

import FormUpIcon from "grommet/components/icons/base/FormUp";
import FormDownIcon from "grommet/components/icons/base/FormDown";
import { formErrorsChange } from "../../../../../../actions/common";
import { connect } from "react-redux";

import { AiOutlineDelete } from "react-icons/ai";

let ArrayUtils = function(props) {
  const {
    propId,
    hasRemove,
    hasMoveDown,
    hasMoveUp,
    onDropIndexClick,
    onReorderClick,
    index,
    reorder,
    formErrors,
    formErrorsChange
  } = props;

  let _deleteAndUpdate = event => {
    update(index);
    onDropIndexClick(index)(event);
  };

  let update = dropIndex => {
    let _formErrors = formErrors
      .filter(errorPath => !errorPath.startsWith(`${propId}_${dropIndex}`))
      .map(errorPath => {
        if (errorPath.startsWith(propId)) {
          let strArr = errorPath.replace(propId, "").split("_");
          let i = parseInt(strArr[1]);

          if (i > dropIndex) {
            strArr[1] = `${i - 1}`;
            return propId + strArr.join("_");
          }
        }

        return errorPath;
      });

    // Use timeout to fire action on the next tick
    formErrorsChange(_formErrors);
  };

  return (
    <Box direction="row" justify="between">
      <Button
        background="#fff"
        hoverBackground="rgb(238,238,238)"
        onClick={hasRemove ? _deleteAndUpdate : null}
        margin="0 0 0 5px"
        icon={<AiOutlineDelete size={18} />}
        size="iconMedium"
        className="fieldTemplate-delete-btn"
      />
      {reorder ? (
        <React.Fragment>
          <Button
            onClick={hasMoveDown ? onReorderClick(index, index + 1) : null}
            icon={<FormDownIcon margin="none" pad="none" />}
          />
          <Button
            onClick={hasMoveUp ? onReorderClick(index, index - 1) : null}
            icon={<FormUpIcon margin="none" pad="none" />}
          />
        </React.Fragment>
      ) : null}
    </Box>
  );
};

ArrayUtils.propTypes = {
  reorder: PropTypes.bool,
  hasRemove: PropTypes.bool,
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  onDropIndexClick: PropTypes.func,
  onReorderClick: PropTypes.func,
  index: PropTypes.number,
  formErrors: PropTypes.array,
  formErrorsChange: PropTypes.func,
  propId: PropTypes.string
};

// export default ArrayUtils;

function mapStateToProps(state) {
  return {
    formErrors: state.draftItem.get("formErrors"),
    formData: state.draftItem.get("formData")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formErrorsChange: errors => dispatch(formErrorsChange(errors))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArrayUtils);
