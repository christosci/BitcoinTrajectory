function parseJson(data, containsBounds = false, xStart = null, xSkipTo = 0) {
  if (containsBounds)
    return data.values.reduce(function(result, point) {
      if (point.x >= xSkipTo)
        result.push({
          x: parseX(point.x, xStart),
          y: point.y,
          yUpper: point.y_upper,
          yLower: point.y_lower
        });
      return result;
    }, []);

  return data.values.reduce(function(result, point) {
    if (point.x >= xSkipTo)
      result.push({
        x: parseX(point.x, xStart),
        y: point.y
      });
    return result;
  }, []);
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
  return (
    '?nocache=' +
    date.getUTCDate() +
    (date.getUTCMonth() + 1) +
    date.getUTCFullYear()
  );
}

function resetSettingsTable() {
  deselectButton(d3.select('#halvings'));
  deselectButton(d3.select('#cycles'));
  deselectButton(d3.select('#cb'));
  selectButton(d3.select('#legend'));
}

// color palette
const BLUE_GREEN = '#147b71';
const GOLD = '#f0e130';
const DARK_GREEN = '#13a038';
const GREEN = '#2ce65f';
const BLUE = '#33ccff';
const RED = '#ee0000';
