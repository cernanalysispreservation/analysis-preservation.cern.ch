export const simpleAdd = [
  { value: "SIMPLE OR", label: "add OR" },
  { value: "SIMPLE AND", label: "add AND" }
];

export const advancedAdd = [
  { value: "NESTED OR", label: "add OR" },
  { value: "NESTED AND", label: "add AND" }
];

export const groupedOptions = [
  {
    label: "Add a simple check",
    options: simpleAdd
  },
  {
    label: "Add a new box with nested checks",
    options: advancedAdd
  }
];
