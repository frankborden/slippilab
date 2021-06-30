export const makeColour = function (
  r: number,
  g: number,
  b: number,
  a: number,
) {
  // maybe some hsl too
  return `rgba(${r},${g},${b},${a})`;
};
