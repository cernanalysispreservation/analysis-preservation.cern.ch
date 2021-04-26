import React, { useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import PropTypes from "prop-types";

function getStyle(opacity) {
  return {
    color: "white",
    textAlign: "center",
    fontSize: "1rem",
    height: "100%",
    opacity: opacity,
    cursor: "move"
  };
}

function SortableBox({ parent, children, id, index, moveCard, card }) {
  const ref = useRef(null);
  const [{ isOverCurrent }, drop] = useDrop({
    accept: `FIELD_TYPE`,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: `FIELD_TYPE`,
      index,
      id,
      card,
      parent
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? (isOverCurrent ? 0.3 : 0) : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={getStyle(opacity)}>
      {children}
    </div>
  );
}

SortableBox.propTypes = {
  parent: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.number,
  index: PropTypes.number,
  moveCard: PropTypes.func
};

export default SortableBox;
