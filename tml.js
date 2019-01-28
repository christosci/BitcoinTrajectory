// defining styles for the visialization element
var vis = d3.select('#visualisation'),
  WIDTH = 500,
  HEIGHT = 200,
  MARGINS = {
    top: 5,
    right: 20,
    bottom: 20,
    left: 50
  },
  PADDING = {
    top: 30,
    bottom: 10,
    right: 10,
    left: 100
  };
vis.style('padding-left', PADDING.left);
vis.style('padding-top', PADDING.top);

// defining scales with their domain and range
var xScale = d3.scale.linear()
  .domain([0, 30])
  .range([0, WIDTH]);

var yScale = d3.scale.linear()
  .domain([1000, 0])
  .range([0, HEIGHT])

// defining axes using scales used above
var xAxis = d3.svg.axis()
  .scale(xScale)
  // .orient('bottom') // by default the the axis is on the top

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left') // by default the the axis is on the top

vis.append("g")
  .call(yAxis);

vis.append("g")
  .attr("transform", "translate(0," + HEIGHT + ")")
  .call(xAxis);

//Plotting the line graph
var lineData = [45, 104, 89, 300, 240, 122, 403, 380, 700, 582, 590, 455, 708, 91, 105, 149, 251, 804, 711, 840, 297, 41, 80, 280, 508, 175, 297, 702, 145, 700];

var lineFunc = d3.svg.line()
  .x(function(d, index) {
    return xScale(index);
  })
  .y(function(d) {
    return yScale(d);
  })
  .interpolate('cardinal');

var path = vis.append('svg:path')
  .attr('d', lineFunc(lineData))
  .attr('stroke', 'blue')
  .attr('stroke-width', 2)
  .attr('fill', 'none');

//Add animation to the line graph
var totalLength = path.node().getTotalLength();

path
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .duration(5000)
  .ease("linear")
  .attr("stroke-dashoffset", 0);