// Input: [ [1, 2, 3], [101, 2, 1, 10], [2, 1] ]
// Output: [1, 2, 3, 101, 10]
const mergeDedupe = (arr) => [...new Set([].concat(...arr))];

// return the array without the specified element
const removeElement = (element, array) => {
  array.splice(array.indexOf(element), 1);
  return array;
};

const removeElements = (elements, array) => {
  let result = elements.reduce((newarray, e) => (newarray = removeElement(e, newarray)), array);
  return result;
};

export default { mergeDedupe, removeElement, removeElements };
