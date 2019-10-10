function parseJson(data, containsBounds = false, xStart = null) {
  if (containsBounds)
    return data.values.map(point => {
      return {
        x: parseX(point.x, xStart),
        y: point.y,
        yUpper: point.y_upper,
        yLower: point.y_lower
      };
    });
  return data.values.map(point => {
    return {
      x: parseX(point.x, xStart),
      y: point.y
    };
  });
}

function parseX(x, xStart = null) {
  if (xStart === null) return d3.timeParse('%s')(x);
  daysFromxStart = (x - xStart) / 86400;
  return daysFromxStart == 0 ? 1 : daysFromxStart;
}

function formatNum(specifier) {
  const siFormat = d3.format(specifier);
  return num => siFormat(num).replace('G', 'B');
}

function selectButton(button) {
  button.attr('class', 'selected');
}

function deselectButton(button) {
  button.attr('class', null);
}

function noCacheStr() {
  const date = new Date();
  return "?nocache=" + date.getUTCDate() + (date.getUTCMonth() + 1) + date.getUTCFullYear();
}

// color palette
const BLUE_GREEN = '#147b71';
const GOLD = '#f0e130';
const DARK_GREEN = '#13a038';
const GREEN = '#2ce65f';
const BLUE = '#33ccff';
const RED = '#ee0000';

