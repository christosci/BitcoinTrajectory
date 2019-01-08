 // const focus = chartBody
  //   .append("g")
  //   .attr("class", "focus")
  //   .style("display", "none");
  // focus.append("circle").attr("r", 4.5);

  // focus
  //   .append("text")
  //   .attr("x", 9)
  //   .attr("dy", ".35em");

  // chartBody
  //   .append("rect")
  //   .attr("class", "overlay")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .on("mouseover", function() {
  //     focus.style("display", null);
  //   })
  //   .on("mouseout", function() {
  //     focus.style("display", "none");
  //   })
  //   .on("mousemove", mousemove);

  // function mousemove() {
  //   var x0 = x.invert(d3.mouse(this)[0]),
  //     i = bisectDate(raw_data, x0, 1),
  //     d0 = raw_data[i - 1],
  //     d1 = raw_data[i],
  //     d = x0 - d0.x > d1.x - x0 ? d1 : d0;
  //   focus.attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");
  //   focus.select("text").text(d.y);
  // }

  
  // const bisectDate = d3.bisector(function(d) {
  //   return d.x;
  // }).left;