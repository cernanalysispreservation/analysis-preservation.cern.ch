import React from "react";
import { useDrag, DragSource } from "react-dnd";

const style = index => ({
  border: "2px dashed #f6f6f6",
  padding: "5px",
  cursor: "move",
  marginBottom: "6px",
  color: "#fff",
  marginRight: index % 2 == 0 ? "0" : "10px",
  marginLeft: index % 2 == 0 ? "10px" : "0"
});

const DraggableBox = ({ data, children, key }) => {
  const type =
    data.default.schema.type === "array" ||
    data.default.schema.type === "object"
      ? "NESTED_TYPE"
      : "FIELD_TYPE";

  const [, drag] = useDrag({
    item: { type: type, data }
  });

  return (
    <div ref={drag} style={style(key)}>
      {children}
    </div>
  );
};

export default DraggableBox;