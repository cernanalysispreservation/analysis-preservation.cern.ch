import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { updateExpandState } from "../../../actions/search";

const ShowMore = ({
  children,
  limit,
  items,
  item,
  more,
  updateExpandState,
  category
}) => {
  const categoryIsIncluded = more.includes(category);
  const [current, setCurrent] = useState(
    categoryIsIncluded ? item : item.slice(0, limit)
  );
  const [filter] = useState(item.size > limit);

  const updateShowMore = category => {
    updateExpandState(category);
  };

  useEffect(
    () => {
      setCurrent(categoryIsIncluded ? item : item.slice(0, limit));
    },
    [more]
  );

  return children({
    current,
    updateShowMore,
    filter,
    countMore: items.length - limit,
    expanded: categoryIsIncluded
  });
};

ShowMore.propTypes = {
  children: PropTypes.func,
  items: PropTypes.array,
  limit: PropTypes.number
};

function mapStateToProps(state) {
  return {
    more: state.search.get("showMore")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExpandState: val => dispatch(updateExpandState(val))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMore);
