const chartDiv = document.getElementById('chart');
const svg = d3.select(chartDiv).append('svg');

class Chart {
  constructor(data, yDomain) {
    this.data = data;
    this.yDomain = yDomain;

    d3.select(window).on('resize', () => this.draw());
  }

  show() {
    var q = d3.queue();
    this.data.forEach(d => {
      q.defer(d3.json, d.path);
    });

    q.awaitAll((error, args) => {
      if (error) throw error;
      let minX = new Date();
      let maxX = new Date(0);

      args.forEach((d, i) => {
        const values = this.parse_json(d);
        this.data[i].values = values;

        const domain = d3.extent(values, d => d.x);
        minX = Math.min(domain[0], minX);
        maxX = Math.max(domain[1], maxX);
      });

      this.xDomain = [minX, maxX];
      this.draw();
    });
  }

  parse_json(data) {
    const parseDate = d3.timeParse('%s');
    return data.values.map(point => {
      return {
        x: parseDate(point.x),
        y: point.y
      };
    });
  }

  draw() {
    d3.selectAll('svg > *').remove();
    this.margin = { top: 20, right: 25, bottom: 30, left: 50 };
    this.clientWidth = chartDiv.clientWidth;
    this.clientHeight = chartDiv.clientHeight;
    this.width = this.clientWidth - this.margin.left - this.margin.right;
    this.height = this.clientHeight - this.margin.top - this.margin.bottom;

    svg.attr('width', this.clientWidth).attr('height', this.clientHeight);

    this.chart = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .call(
        d3
          .zoom()
          .translateExtent([[0, 0], [this.clientWidth, this.clientHeight]])
          .scaleExtent([1, Infinity])
          .on('zoom', this.zoom())
      );

    // clip line paths to the body of the chart
    this.chart
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', this.width)
      .attr('height', this.height);
    this.chartBody = this.chart.append('g').attr('clip-path', 'url(#clip)');

    this.chartBody
      .append('rect')
      .attr('class', 'chartBody')
      .attr('width', this.width)
      .attr('height', this.height);

    this.createScales();
    this.addAxes();
    this.addGridlines();
    this.addLines();
    this.addCrosshairs();

    
  }

  zoom() {
    return () => {
      this.new_xScale = d3.event.transform.rescaleX(this.xScale);
      this.new_yScale = d3.event.transform.rescaleY(this.yScale);
      this.chart.select('.x.grid').call(
        d3
          .axisBottom(this.new_xScale)
          .tickSize(-this.height)
          .tickFormat('')
      );
      this.chart.select('.y.grid').call(
        d3
          .axisLeft(this.new_yScale)
          .ticks(5)
          .tickSize(-this.width)
          .tickFormat('')
      );
      this.chart.select('.x.axis').call(this.xAxis.scale(this.new_xScale));
      this.chart.select('.y.axis').call(this.yAxis.scale(this.new_yScale));
      this.data_paths.map(path => path.attr('transform', d3.event.transform));
    };
  }

  createScales() {
    this.xScale = d3
      .scaleTime()
      .domain(this.xDomain)
      .range([0, this.width]);
    this.yScale = d3
      .scaleLog()
      .domain(this.yDomain)
      .range([this.height, 0])
      .base(10);
    this.new_xScale = this.xScale;
    this.new_yScale = this.yScale;
  }

  addGridlines() {
    this.chartBody
      .append('g')
      .attr('class', 'x grid')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(
        d3
          .axisBottom(this.xScale)
          .tickSize(-this.height)
          .tickFormat('')
      );
    this.chartBody
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
    const valueline = d3
      .line()
      .x(d => this.xScale(d.x))
      .y(d => this.yScale(d.y));
    this.data_paths = this.data.map(d => {
      return this.chartBody
        .append('path')
        .datum(d.values)
        .attr('class', 'data line')
        .attr('stroke', d.stroke)
        .attr('stroke-width', d.strokeWidth)
        .attr('d', valueline);
    });
    // animate the lines
    this.data_paths.forEach((path, i) => {
      let totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(i*1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });
  }

  addAxes() {
    this.xAxis = d3.axisBottom(this.xScale).scale(this.xScale);
    this.yAxis = d3
      .axisLeft(this.yScale)
      .ticks(4, 's')
      .tickFormat(d3.format('.2s'))
      .scale(this.yScale);

    this.chart
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);
    this.chart
      .append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  addCrosshairs() {
    const verticalLine = this.chartBody
      .append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('class', 'crosshair');
    const horizontalLine = this.chartBody
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('class', 'crosshair');

    const yTextBox = this.chart.append('g').attr('opacity', 0);
    const xTextBox = this.chart.append('g').attr('opacity', 0);

    yTextBox
      .append('rect')
      .attr('x', -this.margin.left)
      .attr('width', this.margin.left)
      .attr('height', 18)
      .attr('class', 'yTextBox bg');
    const yText = yTextBox
      .append('text')
      .attr('x', -this.margin.left / 2)
      .attr('y', 13)
      .attr('class', 'yTextBox text');

    xTextBox
      .append('rect')
      .attr('y', this.height)
      .attr('width', 100)
      .attr('height', 18)
      .attr('class', 'xTextBox bg');
    const xText = xTextBox
      .append('text')
      .attr('x', 50)
      .attr('y', this.height + 13)
      .attr('class', 'xTextBox text');

    // update crosshairs
    const self = this;
    this.chartBody
      .on('mousemove', function() {
        const formatY = d3.format('.3s');
        const formatX = d3.timeFormat("%d %b '%y");
        const mouse = d3.mouse(this);
        verticalLine
          .attr('x1', mouse[0])
          .attr('x2', mouse[0])
          .attr('opacity', 1);
        horizontalLine
          .attr('y1', mouse[1])
          .attr('y2', mouse[1])
          .attr('opacity', 1);
        xTextBox
          .attr('transform', 'translate(' + (mouse[0] - 50) + ',0)')
          .attr('opacity', 1);
        yTextBox
          .attr('transform', 'translate(0,' + (mouse[1] - 7) + ')')
          .attr('opacity', 1);
        xText.text(formatX(self.new_xScale.invert(mouse[0])));
        yText.text(formatY(self.new_yScale.invert(mouse[1])));
      })
      .on('mouseout', function() {
        verticalLine.attr('opacity', 0);
        horizontalLine.attr('opacity', 0);
        xTextBox.attr('opacity', 0);
        yTextBox.attr('opacity', 0);
      });
  }
}

const chart = new Chart(
  [
    {
      name: 'Daily transactions excluding popular addresses',
      stroke: '#2ce65f',
      strokeWidth: '1px',
      path: 'data/transactions.json'
    },
    {
      name: 'Power regression',
      stroke: '#ff0000',
      strokeWidth: '2px',
      path: 'data/regressions/transactions_power.json'
    }
  ],
  [100, 1e14]
);

chart.show();
