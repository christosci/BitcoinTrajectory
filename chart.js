const chartDiv = document.getElementById('chart');
const svg = d3.select(chartDiv).append('svg');

class Chart {
  constructor(data, yDomainLog, yDomainLinear) {
    this.data = data;
    this.yDomainLog = yDomainLog;
    this.yDomainLinear = yDomainLinear;

    d3.select(window).on('resize', () => this.draw(true));
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
        const values = this.parseJson(d);
        this.data[i].values = values;

        const domain = d3.extent(values, d => d.x);
        minX = Math.min(domain[0], minX);
        maxX = Math.max(domain[1], maxX);
      });

      this.xDomain = [minX, maxX];
      this.draw();
    });
  }

  parseJson(data) {
    const parseDate = d3.timeParse('%s');
    return data.values.map(point => {
      return {
        x: parseDate(point.x),
        y: point.y
      };
    });
  }

  draw(resize = false) {
    d3.selectAll('svg > *').remove();
    this.margin = { top: 20, right: 50, bottom: 30, left: 50 };
    this.clientWidth = chartDiv.clientWidth;
    this.clientHeight = chartDiv.clientHeight;
    this.width = this.clientWidth - this.margin.left - this.margin.right;
    this.height = this.clientHeight - this.margin.top - this.margin.bottom;

    this.createCanvas();
    if (!resize) {
      this.createScales();
      this.addLegend();
      this.updateScale();
      this.resetZoom();
    } else {
      this.resizeScales();
    }
    this.addHalvings(resize);
    this.addCycles(resize);
    this.addAxes();
    this.addGridlines();
    this.addLines(resize);
    this.addCrosshairs();
  }

  createCanvas() {
    svg.attr('width', this.clientWidth).attr('height', this.clientHeight);
    this.zoom = d3
      .zoom()
      .translateExtent([[0, 0], [this.clientWidth, this.clientHeight]])
      .scaleExtent([1, Infinity])
      .wheelDelta(
        () => (-d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)) / 2000
      )
      .on('zoom', this.zoomed())
      

    this.chart = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .call(this.zoom);

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
  }

  zoomed() {
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
      this.dataPaths.forEach(path =>
        path.attr('transform', d3.event.transform).attr('stroke-dasharray', 0)
      );
      this.halvingsData.forEach(d =>
        d.path.attr('transform', d3.event.transform)
      );
      this.cyclesData.forEach(d =>
        d.rect.attr('transform', d3.event.transform)
      );
    };
  }

  createScales() {
    this.xScale = d3
      .scaleTime()
      .domain(this.xDomain)
      .range([0, this.width]);
    this.yScale = d3
      .scaleLog()
      .domain(this.yDomainLog)
      .range([this.height, 0]);
    this.new_xScale = this.xScale;
    this.new_yScale = this.yScale;
  }

  resizeScales() {
    this.xScale.range([0, this.width]);
    this.yScale.range([this.height, 0]);
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

  addLines(resize) {
    const valueline = d3
      .line()
      .x(d => this.xScale(d.x))
      .y(d => this.yScale(d.y));
    this.dataPaths = this.data.map(d => {
      return this.chartBody
        .append('path')
        .datum(d.values)
        .attr('class', 'data line')
        .attr('stroke', d.stroke)
        .attr('stroke-width', d.strokeWidth)
        .attr('d', valueline);
    });
    // animate the lines
    if (!resize) {
      this.hasTransitionEnded = false;
      this.dataPaths.forEach((path, i) => {
        let totalLength = path.node().getTotalLength();
        path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1000)
          .delay(i * 1000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            if (i === this.dataPaths.length - 1) this.hasTransitionEnded = true;
          });
      });
    }
  }

  addAxes() {
    const siFormat = d3.format('.1s');
    this.xAxis = d3.axisBottom(this.xScale).scale(this.xScale);
    this.yAxis = d3
      .axisLeft(this.yScale)
      .ticks(4, 's')
      .tickFormat(x => siFormat(x).replace('G', 'B'))
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
        const siFormat = d3.format('.3s');
        const formatY = y => siFormat(y).replace('G', 'B');
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

  updateScale() {
    const changeScale = () => {
      let t = d3.zoomTransform(svg.node());
      this.new_yScale = t.rescaleY(this.yScale);
      this.new_xScale = t.rescaleX(this.xScale);
      const valueline = d3
        .line()
        .x(d => this.new_xScale(d.x))
        .y(d => this.new_yScale(d.y));

      this.dataPaths.forEach(line => {
        if (this.hasTransitionEnded) {
          line
            .transition()
            .duration(1000)
            .attr('d', valueline);
        } else {
          line.attr('d', valueline);
        }
      });

      this.yAxis.scale(this.new_yScale);

      this.chart
        .transition()
        .duration(1000)
        .select('.y.axis')
        .call(this.yAxis);
      this.chart
        .transition()
        .duration(1000)
        .select('.y.grid')
        .call(
          d3
            .axisLeft(this.new_yScale)
            .ticks(5)
            .tickSize(-this.width)
            .tickFormat('')
        );
    };
    const logButton = d3.select('#logScale');
    const linearButton = d3.select('#linearScale');
    logButton.on('click', () => {
      logButton.attr('class', 'selected');
      linearButton.attr('class', null);
      this.yScale = d3.scaleLog();
      this.yScale.range([this.height, 0]).domain(this.yDomainLog);
      changeScale();
    });
    linearButton.on('click', () => {
      linearButton.attr('class', 'selected');
      logButton.attr('class', null);
      this.yScale = d3.scaleLinear();
      this.yScale.range([this.height, 0]).domain(this.yDomainLinear);
      changeScale();
    });
  }

  addHalvings(resize) {
    d3.queue()
      .defer(d3.json, 'data/halvings.json')
      .await((error, data) => {
        if (error) throw error;
        this.halvingsData = data.values;
        const parseDate = d3.timeParse('%s');
        this.halvingsData.forEach(d => {
          d.x = parseDate(d.x);
          d.path = this.chartBody
            .append('line')
            .attr('class', 'halvingsline')
            .attr('x1', this.new_xScale(d.x))
            .attr('y1', this.height)
            .attr('x2', this.new_xScale(d.x))
            .attr('y2', this.height);
        });
        const halvingsline = d3.selectAll('.halvingsline');
        const halvingsButton = d3.select('#halvings');
        if (resize && halvingsButton.attr('class') === 'selected') {
          halvingsline
            .attr('y2', 0);
        }
        halvingsButton.on('click', () => {
          if (halvingsButton.attr('class') !== 'selected') {
            halvingsButton.attr('class', 'selected');
            halvingsline
              .transition()
              .ease(d3.easeExp)
              .duration(750)
              .attr('y2', 0);
          } else {
            halvingsButton.attr('class', null);
            halvingsline
              .transition()
              .ease(d3.easeExp)
              .duration(750)
              .attr('y2', this.height);
          }
        });
      });
  }

  addCycles(resize) {
    d3.queue()
      .defer(d3.json, 'data/cycles.json')
      .await((error, data) => {
        if (error) throw error;
        this.cyclesData = data.values;
        const parseDate = d3.timeParse('%s');
        this.cyclesData.forEach(d => {
          d.start = parseDate(d.start);
          d.end = d.end == null ? new Date() : parseDate(d.end);
          d.rect = this.chartBody
            .append('rect')
            .attr('class', 'cyclesline ' + d.cycle)
            .attr('x', this.new_xScale(d.start))
            .attr('y', 0)
            .attr('height', this.height)
            .attr('width', this.new_xScale(d.end) - this.new_xScale(d.start))
            .attr('opacity', 0);
        });
        const cyclesline = d3.selectAll('.cyclesline');
        const cyclesButton = d3.select('#cycles');
        if (resize && cyclesButton.attr('class') === 'selected') {
          cyclesline
            .attr('opacity', 0.1);
        }
        cyclesButton.on('click', () => {
          if (cyclesButton.attr('class') !== 'selected') {
            cyclesButton.attr('class', 'selected');
            cyclesline
              .transition()
              .ease(d3.easeLinear)
              .duration(750)
              .attr('opacity', 0.1);
          } else {
            cyclesButton.attr('class', null);
            cyclesline
              .transition()
              .ease(d3.easeLinear)
              .duration(750)
              .attr('opacity', 0);
          }
        });
      });
  }

  resetZoom() {
    const resetZoom = () => {
      this.chart
        .transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity);
    };
    d3.select('#resetZoom').on('click', resetZoom);
  }

  addLegend() {
    const bottomBar = d3.select('#bottom-bar .contents');
    const list = bottomBar.append('ul');
    this.data.forEach(d => {
      list
        .append('li')
        .style('color', d.stroke)
        .append('span')
        .html(d.name);
    });
  }
}
