class Thumbnail {
  constructor(div, data, yScale, minY = null) {
    this.div = div;
    this.data = data;
    this.yScale = yScale;
    this.minY = minY; 
  }

  show() {
    var q = d3.queue();
    this.data.forEach(d => {
      q.defer(d3.json, d.jsonPath);
    });

    q.awaitAll((error, args) => {
      if (error) throw error;
      let minX = new Date();
      let maxX = new Date(0);
      let minY = Number.MAX_VALUE;
      let maxY = 0;

      args.forEach((d, i) => {
        const values = parseJson(d);
        this.data[i].values = values;

        const xDomain = d3.extent(values, d => d.x);
        minX = Math.min(xDomain[0], minX);
        maxX = Math.max(xDomain[1], maxX);

        const yDomain = d3.extent(values, d => d.y);
        minY = Math.min(yDomain[0], minY);
        maxY = Math.max(yDomain[1], maxY);
      });

      this.xDomain = [minX, maxX];
      this.yDomain = this.minY === null ? [minY, maxY] : [this.minY, maxY];
      this.draw();
    });
  }

  draw() {
    const chartDiv = document.getElementById(this.div);
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
    this.xScale = d3
      .scaleTime()
      .domain(this.xDomain)
      .range([0, this.width]);
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
