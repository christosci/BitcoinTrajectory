const chartDiv = document.getElementById('chart');
const svg = d3.select(chartDiv).append('svg');

class Chart {
  constructor(title, data, yDomainLog, yDomainLinear) {
    this.title = title;
    this.data = data;
    this.yDomainLog = yDomainLog;
    this.yDomainLinear = yDomainLinear;

    d3.select(window).on('resize', () => this.draw(true));
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

      args.forEach((d, i) => {
        const values = parseJson(d, this.data[i].containsBounds);
        this.data[i].values = values;

        const domain = d3.extent(values, d => d.x);
        minX = Math.min(domain[0], minX);
        maxX = Math.max(domain[1], maxX);
      });

      this.xDomain = [minX, maxX];
      this.draw();
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
    this.addConfidenceBands(resize);
    this.addCrosshairs();
    this.addLegend();
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
      .on('zoom', this.zoomed());

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
      this.data.forEach(d =>
        d.path.attr('transform', d3.event.transform).attr('stroke-dasharray', 0)
      );
      this.halvingsData.forEach(d =>
        d.path.attr('transform', d3.event.transform)
      );
      this.cyclesData.forEach(d =>
        d.rect.attr('transform', d3.event.transform)
      );
      this.cbPaths.forEach(path =>
        path.attr('transform', d3.event.transform)
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
    const plotLine = d3
      .line()
      .x(d => this.xScale(d.x))
      .y(d => this.yScale(d.y));
    this.data.forEach(d => {
      d.path = this.chartBody
        .append('path')
        .datum(d.values)
        .attr('class', 'data line')
        .attr('stroke', d.style.stroke)
        .attr('stroke-width', d.style.strokeWidth)
        .attr('d', plotLine);
    });
    // animate the lines
    if (!resize) {
      this.hasTransitionEnded = false;
      this.data.forEach(d => {
        const totalLength = d.path.node().getTotalLength();
        d.path
          .attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(d.transition.duration)
          .delay(d.transition.delay)
          .ease(d.transition.ease)
          .attr('stroke-dashoffset', 0)
          .on('start', () => (this.hasTransitionEnded = false))
          .on('end', () => (this.hasTransitionEnded = true));
      });
    }
  }

  addAxes() {
    const siFormat = d3.format('.1s');
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3
      .axisLeft(this.yScale)
      .ticks(5, 's')
      .tickFormat(x => siFormat(x).replace('G', 'B'));

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
          .attr('transform', 'translate(0,' + (mouse[1] - 9) + ')')
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
      this.new_yScale = this.yScale;
      this.new_xScale = this.xScale;
      this.yAxis.scale(this.new_yScale);
      const plotLine = d3
        .line()
        .x(d => this.new_xScale(d.x))
        .y(d => this.new_yScale(d.y));

      this.data.forEach(d => {
        if (this.hasTransitionEnded) {
          d.path
            .transition()
            .duration(1000)
            .attr('d', plotLine);
        } else {
          d.path.attr('d', plotLine);
        }
      });

      this.cbPaths.forEach(path => {
        const plotFunc = path.classed('upperbound')
          ? this.plotUpperBound
          : this.plotLowerBound;
        if (this.hasTransitionEnded) {
          path
            .transition()
            .duration(1000)
            .attr('d', plotFunc);
        } else path.attr('d', plotFunc);
      });

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
    logButton.on('click', () => {
      this.chart.call(this.zoom.transform, d3.zoomIdentity);
      if (logButton.classed('selected')) {
        deselectButton(logButton);
        this.yScale = d3.scaleLinear();
        this.yScale.range([this.height, 0]).domain(this.yDomainLinear);
      } else {
        selectButton(logButton);
        this.yScale = d3.scaleLog();
        this.yScale.range([this.height, 0]).domain(this.yDomainLog);
      }
      changeScale();
    });
  }

  addHalvings(resize) {
    d3.queue()
      .defer(d3.json, '../data/static/halvings.json')
      .await((error, data) => {
        if (error) throw error;
        this.halvingsData = data.values;
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
        if (resize && halvingsButton.classed('selected')) {
          halvingsline.attr('y2', 0);
        }
        halvingsButton.on('click', () => {
          if (!halvingsButton.classed('selected')) {
            selectButton(halvingsButton);
            halvingsline
              .transition()
              .ease(d3.easeExp)
              .duration(750)
              .attr('y2', 0);
          } else {
            deselectButton(halvingsButton);
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
      .defer(d3.json, '../data/static/cycles.json')
      .await((error, data) => {
        if (error) throw error;
        this.cyclesData = data.values;
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
        if (resize && cyclesButton.classed('selected')) {
          cyclesline.attr('opacity', 0.1);
        }
        cyclesButton.on('click', () => {
          if (!cyclesButton.classed('selected')) {
            selectButton(cyclesButton);
            cyclesline
              .transition()
              .ease(d3.easeLinear)
              .duration(750)
              .attr('opacity', 0.1);
          } else {
            deselectButton(cyclesButton);
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

  addConfidenceBands(resize) {
    this.cbPaths = [];
    this.plotUpperBound = d3
      .line()
      .x(d => this.new_xScale(d.x))
      .y(d => this.new_yScale(d.yUpper));
    this.plotLowerBound = d3
      .line()
      .x(d => this.new_xScale(d.x))
      .y(d => this.new_yScale(d.yLower));

    this.data.forEach(d => {
      if (d.containsBounds) {
        const upperBound = this.chartBody
          .append('path')
          .datum(d.values)
          .attr('class', 'data line upperbound cb')
          .attr('stroke-width', d.style.strokeWidth)
          .attr('opacity', 0)
          .attr('d', this.plotUpperBound);
        const lowerBound = this.chartBody
          .append('path')
          .datum(d.values)
          .attr('class', 'data line lowerbound cb')
          .attr('stroke-width', d.style.strokeWidth)
          .attr('opacity', 0)
          .attr('d', this.plotLowerBound);
        this.cbPaths.push(upperBound, lowerBound);
      }
    });

    const cbLines = d3.selectAll('.line.cb');
    const cbButton = d3.select('#cb');
    cbButton.on('click', () => {
      if (!cbButton.classed('selected')) {
        selectButton(cbButton);
        cbLines.attr('opacity', 1);
      } else {
        deselectButton(cbButton);
        cbLines.attr('opacity', 0);
      }
    });
  }

  addLegend() {
    const ordinal = d3
      .scaleOrdinal()
      .domain(this.data.map(d => d.name))
      .range(this.data.map(d => d.style.stroke));

    const legendElement = this.chart
      .append('g')
      .attr('class', 'legendOrdinal')
      .call(
        d3
          .legendColor()
          .title(this.title)
          .shape(
            'path',
            d3
              .symbol()
              .type(d3.symbolSquare)
              .size(50)()
          )
          // .shapePadding(0)
          // use cellFilter to hide the "e" cell
          .cellFilter(function(d) {
            return d.label !== 'e';
          })
          .scale(ordinal)
      );

    legendElement.attr(
      'transform',
      'translate(' +
        (this.width - legendElement.node().getBBox().width) +
        ', ' +
        (this.height - legendElement.node().getBBox().height - 20) +
        ')'
    );

    const legendButton = d3.select('#legend');
    legendButton.on('click', () => {
      const opacity = legendButton.classed('selected') ? 0 : 1;
      const newClass = opacity == 1 ? 'selected' : null;
      legendElement.style('opacity', opacity);
      legendButton.attr('class', newClass);
    });
  }
}
