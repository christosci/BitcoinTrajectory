const chartDiv = document.getElementById("chart");
const svg = d3.select(chartDiv).append("svg");

let raw_data, regression;

function render() {
  d3.selectAll("svg > *").remove();
  const margin = { top: 20, right: 25, bottom: 30, left: 50 },
    clientWidth = chartDiv.clientWidth,
    clientHeight = chartDiv.clientHeight,
    width = clientWidth - margin.left - margin.right,
    height = clientHeight - margin.top - margin.bottom;

  const update_crosshair_values = function() {
    const formatY = d3.format(".3s");
    const formatX = d3.timeFormat("%d %b '%y");
    const mouse = d3.mouse(this);
    verticalLine
      .attr("x1", mouse[0])
      .attr("x2", mouse[0])
      .attr("opacity", 1);
    horizontalLine
      .attr("y1", mouse[1])
      .attr("y2", mouse[1])
      .attr("opacity", 1);
    xTextBox
      .attr("transform", "translate(" + (mouse[0] - 50) + ",0)")
      .attr("opacity", 1);
    yTextBox
      .attr("transform", "translate(0," + (mouse[1] - 7) + ")")
      .attr("opacity", 1);
    xText.text(formatX(new_xScale.invert(mouse[0])));
    yText.text(formatY(new_yScale.invert(mouse[1])));
  };

  // set the ranges
  const xScale = d3
    .scaleTime()
    .domain([regression[0].x, regression[regression.length - 1].x])
    .range([0, width]);
  const yScale = d3
    .scaleLog()
    .domain([100, 10000000])
    .range([height, 0])
    .base(10);
  let new_xScale = xScale;
  let new_yScale = yScale;

  // Zoom Function
  const zoom = d3
    .zoom()
    .translateExtent([[0, 0], [clientWidth, clientHeight]])
    .scaleExtent([1, Infinity])
    .on("zoom", () => {
      new_yScale = d3.event.transform.rescaleY(yScale);
      new_xScale = d3.event.transform.rescaleX(xScale);

      chart.select(".y.grid").call(
        d3
          .axisLeft(new_yScale)
          .ticks(5)
          .tickSize(-width)
          .tickFormat("")
      );
      chart.select(".x.grid").call(
        d3
          .axisBottom(new_xScale)
          .tickSize(-height)
          .tickFormat("")
      );
      chart.select(".y.axis").call(yAxis.scale(new_yScale));
      chart.select(".x.axis").call(xAxis.scale(new_xScale));

      data1_path.attr("transform", d3.event.transform);
      data2_path.attr("transform", d3.event.transform);
    });

  svg.attr("width", clientWidth).attr("height", clientHeight);

  const chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
  chart
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

  const chartBody = chart.append("g").attr("clip-path", "url(#clip)");

  const xAxis = d3.axisBottom(xScale).scale(xScale);
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(4, "s")
    .tickFormat(d3.format(".0s"))
    .scale(yScale);

  const valueline = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  // add the X gridlines
  chartBody
    .append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(-height)
        .tickFormat("")
    );

  // add the Y gridlines
  chartBody
    .append("g")
    .attr("class", "y grid")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-width)
        .tickFormat("")
    );

  // Add the raw data path.
  const data1_path = chartBody
    .append("path")
    .datum(raw_data)
    .attr("class", "raw_data")
    .attr("d", valueline);

  // Add the regression path.
  const data2_path = chartBody
    .append("path")
    .datum(regression)
    .attr("class", "regression")
    .attr("d", valueline);

  // Add the X Axis
  chart
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  chart
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // append zoom area
  chartBody
    .append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height);

  // crosshairs
  const transpRect = chartBody
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white")
    .attr("opacity", 0);

  const verticalLine = chartBody
    .append("line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("class", "crosshair");

  const horizontalLine = chartBody
    .append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("class", "crosshair");

  const yTextBox = chart.append("g").attr("opacity", 0);
  const xTextBox = chart.append("g").attr("opacity", 0);

  yTextBox
    .append("rect")
    .attr("x", -margin.left)
    .attr("width", margin.left)
    .attr("height", 18)
    .attr("class", "yTextBox bg");

  const yText = yTextBox
    .append("text")
    .attr("x", -margin.left / 2)
    .attr("y", d3.select(".yTextBox.bg").attr("height") - 5)
    .attr("class", "yTextBox text");

  xTextBox
    .append("rect")
    .attr("y", height)
    .attr("width", 100)
    .attr("height", 18)
    .attr("class", "xTextBox bg");

  const xText = xTextBox
    .append("text")
    .attr("x", 50)
    .attr("y", height + 13)
    .attr("class", "xTextBox text");

  transpRect
    .on("mousemove", update_crosshair_values)
    .on("mouseout", function() {
      verticalLine.attr("opacity", 0);
      horizontalLine.attr("opacity", 0);
      xTextBox.attr("opacity", 0);
      yTextBox.attr("opacity", 0);
    });
}

function parse_json(data) {
  const parseDate = d3.timeParse("%s");
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
