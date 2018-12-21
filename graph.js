var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");

var raw_data;
var regression;

function render() {
  d3.selectAll("svg > *").remove();
  var margin = { top: 20, right: 25, bottom: 30, left: 50 },
    width = chartDiv.clientWidth - margin.left - margin.right,
    height = chartDiv.clientHeight - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3
    .scaleLog()
    .range([height, 0])
    .base(10)
    .clamp(true);

  var valueline = d3
    .line()
    .x(d => {
      return x(d.x);
    })
    .y(d => {
      return y(d.y);
    });

  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range
  x.domain([regression[0].x, regression[regression.length - 1].x]);
  y.domain([100, 10000000]);

  // Add the valueline path.
  chart
    .append("path")
    .data([raw_data])
    .attr("class", "line")
    .attr("d", valueline);

  // Add the valueline2 path.
  chart
    .append("path")
    .data([regression])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline);

  // Add the X Axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  chart
    .append("g")
    .attr("class", "axisSteelBlue")
    .call(
      d3
        .axisLeft(y)
        .ticks(4, "s")
        .tickFormat(d3.format(".0s"))
    );
}

function parse_json(data) {
  var parseDate = d3.timeParse("%s");
  return data.values.map(point => {
    return {
      x: parseDate(point.x),
      y: point.y
    };
  });
}

d3.queue()
  .defer(d3.json, "data/transactions.json")
  .defer(d3.json, "data/regressions/transactions_power.json")
  .await((error, data1, data2) => {
    if (error) throw error;
    raw_data = parse_json(data1);
    regression = parse_json(data2);

    render();
    window.addEventListener("resize", render);
  });
