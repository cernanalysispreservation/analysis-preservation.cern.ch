import React from "react";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import Button from "../../partials/Button";
import { Box } from "grommet";
import "./Pagination.css";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineForward,
  AiOutlineBackward
} from "react-icons/ai";

const SearchPagination = ({
  total_results = 0,
  size = 10,
  current_page = 1,
  onPageChange = null,
  onPageSizeChange = null
}) => {
  const updatePageFromArrows = move => {
    if (move > 0) {
      if (current_page < size) onPageChange(current_page + 1);
    } else {
      if (current_page > 1) onPageChange(current_page - 1);
    }
  };

  return (
    <Pagination
      total={total_results}
      pageSize={size}
      current={current_page}
      onChange={onPageChange}
      jumpPrevIcon={
        <span
          style={{
            display: "inline-block",
            lineHeight: 0,
            textAlign: "center",
            verticalAlign: "-.165em"
          }}
        >
          <AiOutlineBackward />
        </span>
      }
      jumpNextIcon={
        <span
          style={{
            display: "inline-block",
            lineHeight: 0,
            textAlign: "center",
            verticalAlign: "-.165em"
          }}
        >
          <AiOutlineForward />
        </span>
      }
      prevIcon={
        <span
          style={{
            display: "inline-block",
            lineHeight: 0,
            textAlign: "center",
            verticalAlign: "-.225em"
          }}
        >
          <AiOutlineLeft onClick={() => updatePageFromArrows(-1)} />
        </span>
      }
      nextIcon={
        <span
          style={{
            display: "inline-block",
            lineHeight: 0,
            textAlign: "center",
            verticalAlign: "-.100em"
          }}
        >
          <AiOutlineRight onClick={() => updatePageFromArrows(+1)} />
        </span>
      }
      locale={{
        items_per_page: "Items per page",
        jump_to: "Go to",
        jump_to_confirm: "Confirm jump to",
        page: null,
        prev_page: "Previous page",
        next_page: "Next page",
        prev_5: "Previous 5",
        next_5: "Next 5",
        prev_3: "Previous 3",
        next_3: "Next 3"
      }}
    />
  );
};

SearchPagination.propTypes = {};

export default SearchPagination;
