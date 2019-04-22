class Thumbnail {
  constructor(div, data) {
    this.div = div;
    this.data = data;
  }

  show(yScale = d3.scaleLog(), minY_override = null, xStart = null) {
    this.yScale = yScale;
    this.xStart = xStart;

    let minX = new Date();
    let maxX = new Date(0);
    let minY = Number.MAX_VALUE;
    let maxY = 0;

    this.data.forEach(d => {
      if (this.xStart !== null) {
        d.values.forEach(point => {
          point.x = parseX(point.x.getTime()/1000, this.xStart);
        });
      }
      const xDomain = d3.extent(d.values, d => d.x);
      minX = Math.min(xDomain[0], minX);
      maxX = Math.max(xDomain[1], maxX);

      const yDomain = d3.extent(d.values, d => d.y);
      minY = Math.min(yDomain[0], minY);
      maxY = Math.max(yDomain[1], maxY);
    });

    this.xDomain = [minX, maxX];
    this.yDomain = minY_override === null ? [minY, maxY] : [minY_override, maxY];
    this.draw();
  }

  draw() {
    const chartDiv = document.getElementById(this.div);
    d3.select(chartDiv).classed('spinner', false);
    this.width = 400;
    this.height = 250;
    this.svg = d3
      .select(chartDiv)
      .append('svg')
      .attr('preserveAspectRatio', 'none')
      .attr('viewBox', '0 0 400 250')
      .classed('svg-content', true);
    this.createScales();
    this.addGridlines();
    this.addLines();
  }

  createScales() {
    this.xScale = this.xStart === null ? d3.scaleTime() : d3.scaleLog();
    this.xScale.domain(this.xDomain).range([0, this.width]);
    this.yScale.domain(this.yDomain).range([this.height, 0]);
  }

  addGridlines() {
    this.svg
      .append('g')
      .attr('class', 'y grid')
      .call(
        d3
          .axisLeft(this.yScale)
          .ticks(5)
          .tickSize(-this.width)
          .tickFormat('')
      );
  }

  addLines() {
    const plotLine = d3
      .line()
      .x(d => this.xScale(d.x))
      .y(d => this.yScale(d.y));
    this.data.forEach(d => {
      d.path = this.svg
        .append('path')
        .datum(d.values)
        .attr('class', 'data line')
        .attr('stroke', d.style.stroke)
        .attr('stroke-width', d.style.strokeWidth)
        .attr('d', plotLine);
    });
  }
}
