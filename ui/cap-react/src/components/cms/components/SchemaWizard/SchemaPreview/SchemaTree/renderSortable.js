import React from "react";
import SortableBox from "./SortableBox";

const RenderSortable = (parent, card, i, moveCard, dependencyProp) => {
  if (card === undefined || card.prop === undefined) {
    return null;
  }
  return (
    <SortableBox
      parent={parent}
      key={card.id}
      index={i}
      id={card.id}
      text={card.name}
      moveCard={moveCard}
      dependencyProp={dependencyProp}
    >
      {card.prop.content}
    </SortableBox>
  );
};

export default RenderSortable;
