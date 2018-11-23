var svg = d3.select("svg"),
  margin = { top: 20, right: 80, bottom: 110, left: 80 },
  margin2 = { top: 430, right: 80, bottom: 30, left: 80 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
  x2 = d3.scaleTime().range([0, width]),
  y = d3.scaleLog().range([height, 0]).base(10),
  y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
  xAxis2 = d3.axisBottom(x2),
  yAxis = d3.axisLeft(y).ticks(7).tickFormat(function(d){
    return d3.format("($.2f")(d);
  });

var brush = d3
  .brushX()
  .extent([[0, 0], [width, height2]])
  .on("brush end", brushed);

var zoom = d3
  .zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

var line = d3
  .line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.price);
  });

var line2 = d3
  .line()
  .x(function(d) {
    return x2(d.date);
  })
  .y(function(d) {
    return y2(d.price);
  });

var clip = svg
  .append("defs")
  .append("svg:clipPath")
  .attr("id", "clip")
  .append("svg:rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0);

var Line_chart = svg
  .append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("clip-path", "url(#clip)");

var focus = svg
  .append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg
  .append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.json("close.json", function(error, data) {
  if (error) throw error;

  var data = Object.keys(data.bpi).map(function(date) {
    return {
      date: parseDate(date),
      price: data.bpi[date]
    };
  });

  x.domain(
    d3.extent(data, function(d) {
      return d.date;
    })
  );
  y.domain([
    0.01,
    1000000
  ]);
  x2.domain(x.domain());
  y2.domain([
    0,
    d3.max(data, function(d) {
      return d.price;
    })
  ]);

  focus
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  focus
    .append("g")
    .attr("class", "axis axis--y")
    .call(yAxis);

  Line_chart.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  context
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line2);

  context
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  context
    .append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x.range());

  svg
    .append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  Line_chart.select(".line").attr("d", line);
  focus.select(".axis--x").call(xAxis);
  svg
    .select(".zoom")
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
    );
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  Line_chart.select(".line").attr("d", line);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}