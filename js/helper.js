const parseDate = d3.timeParse('%s');

function parseJson(data, containsBounds = false) {
  if (containsBounds)
    return data.values.map(point => {
      return {
        x: parseDate(point.x),
        y: point.y,
        yUpper: point.y_upper,
        yLower: point.y_lower
      };
    });
  return data.values.map(point => {
    return {
      x: parseDate(point.x),
      y: point.y
    };
  });
}

function selectButton(button) {
  button.attr('class', 'selected');
}

function deselectButton(button) {
  button.attr('class', null);
}
