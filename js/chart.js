const chartDiv = document.getElementById('chart');
let svg = d3.select(chartDiv).append('svg');

class Chart {
  constructor(title, data) {
    this.title = title;
    this.data = data;

    d3.select(window).on('resize', () => {
      this.draw(true);
      if (this.bottomChart != null) this.bottomChart.draw(true);
    });
  }

  show(yDomainLog, yDomainLinear, xStart = null, xSkipTo = 0) {
    this.yDomainLog = yDomainLog;
    this.yDomainLinear = yDomainLinear;
    this.xStart = xStart;
    this.heightFactor = 1;

    const noCache = noCacheStr();
    const q = d3.queue();

    this.data.forEach(d => {
      q.defer(d3.json, d.jsonPath + noCache);
    });

    q.awaitAll((error, args) => {
      if (error) throw error;
      let minX = new Date();
      let maxX = new Date(0);

      args.forEach((d, i) => {
        let values = parseJson(
          d,
          this.data[i].containsBounds,
          this.xStart,
          xSkipTo
        );
        this.data[i].values = values;
        if (d.r2 !== undefined)
          this.data[i].name += ', R^2 = ' + d.r2;

        const domain = d3.extent(values, d => d.x);
        minX = Math.min(domain[0], minX);
        maxX = Math.max(domain[1], maxX);
      });
      this.xDomain = [minX, maxX];
      if (this.bottomChart != null)
        this.showBottomChart(bottomChart, this.yDomainBottom);
      this.draw();
    });
  }

  setBottomChart(bottomChart, yDomain) {
    this.bottomChart = bottomChart;
    this.yDomainBottom = yDomain;
  }

  showBottomChart() {
    this.heightFactor = 0.75;
    bottomChart.show(this.yDomainBottom, this.xDomain);
  }

  draw(resize = false) {
    if (resize) {
      svg.remove();
      svg = d3.select(chartDiv).append('svg');
      resetSettingsTable();
    }
    this.margin = { top: 20, right: 50, bottom: 30, left: 50 };
    this.clientWidth = chartDiv.clientWidth;
    this.clientHeight = chartDiv.clientHeight * this.heightFactor - 40;
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
    svg.attr('width', this.clientWidth).attr('height', chartDiv.clientHeight);
    const extent = [[0, 0], [this.clientWidth, this.clientHeight]];
    const scaleExtent = [[0, Infinity], [0, Infinity]];
    const translateExtent = [[0, 0], [this.clientWidth, this.clientHeight]];

    const newZoom = handler =>
      d3
        .xyzoom()
        .extent(extent)
        .scaleExtent(scaleExtent)
        .translateExtent(translateExtent)
        .wheelDelta(
          () => (-d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)) / 2000
        )
        .on('zoom', handler);

    this.xzoom = newZoom(this.xzoomed());
    this.yzoom = newZoom(this.yzoomed());
    this.xyzoom = newZoom(this.xyzoomed());

    this.chart = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .attr('class', 'chart')
      .call(this.xyzoom);

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

    this.addZoomRects();
  }

  addZoomRects() {
    const newZoomRect = (id, x, y, w, h, zoom) =>
      svg
        .append('svg:rect')
        .attr('id', id)
        .attr('width', w)
        .attr('height', h)
        .attr('transform', 'translate(' + x + ',' + y + ')')
        .attr('opacity', '0')
        .attr('pointer-events', 'all')
        .call(zoom);

    this.xrect = newZoomRect(
      'xZoomRect',
      this.margin.left,
      chartDiv.clientHeight - 70,
      this.width,
      this.margin.bottom,
      this.xzoom
    );

    this.yrect = newZoomRect(
      'yZoomRect',
      0,
      this.margin.top,
      this.margin.left,
      this.height,
      this.yzoom
    );
  }

  newTransform(x, y, kx, ky) {
    return d3.xyzoomIdentity.translate(x, y).scale(kx, ky);
  }

  xzoomed() {
    return () => {
      const t = d3.event.transform;
      if (t.y != 0 || t.ky != 1) {
        return this.xrect.call(
          this.xzoom.transform,
          this.newTransform(t.x, 0, t.kx, 1)
        );
      }
      const xOld = d3.xyzoomTransform(this.xrect.node());
      const xyOld = d3.xyzoomTransform(this.chart.node());
      const xyNew = this.newTransform(t.x, xyOld.y, t.kx, xyOld.ky);
      if (xyNew.x != xyOld.x || xyNew.kx != xyOld.kx) {
        this.chart.call(this.xyzoom.transform, xyNew);
      }
    };
  }

  yzoomed() {
    return () => {
      const t = d3.event.transform;
      if (t.x != 0 || t.kx != 1) {
        return this.yrect.call(
          this.yzoom.transform,
          this.newTransform(0, t.y, 1, t.ky)
        );
      }
      const xyOld = d3.xyzoomTransform(this.chart.node());
      const xyNew = d3.xyzoomIdentity
        .translate(xyOld.x, t.y)
        .scale(xyOld.kx, t.ky);
      if (xyNew.y != xyOld.y || xyNew.ky != xyOld.ky) {
        this.chart.call(this.xyzoom.transform, xyNew);
      }
    };
  }

  xyzoomed() {
    return () => {
      const t = d3.event.transform;
      if (this.bottomChart != null) this.bottomChart.zoomHandler(t);
      const xOld = d3.xyzoomTransform(this.xrect.node());
      const yOld = d3.xyzoomTransform(this.yrect.node());

      this.new_xScale = t.rescaleX(this.xScale);
      this.new_yScale = t.rescaleY(this.yScale);

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
      svg.select('.x.axis').call(this.xAxis.scale(this.new_xScale));
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
      this.cbPaths.forEach(path => path.attr('transform', d3.event.transform));

      if (xOld.x != t.x || xOld.kx != t.kx) {
        this.xrect.call(
          this.xzoom.transform,
          this.newTransform(t.x, 0, t.kx, 1)
        );
      }
      if (yOld.y != t.y || yOld.ky != t.ky) {
        this.yrect.call(
          this.yzoom.transform,
          this.newTransform(0, t.y, 1, t.ky)
        );
      }
    };
  }

  createScales() {
    this.xScale = this.xStart === null ? d3.scaleTime() : d3.scaleLog();
    this.xScale.domain(this.xDomain).range([0, this.width]);
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
    this.data.forEach((d, i) => {
      d.path = this.chartBody
        .append('path')
        .datum(d.values)
        .attr('class', 'data line datum' + i)
        .attr('stroke', d.style.stroke)
        .attr('opacity', 1)
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
    this.xAxis = d3.axisBottom(this.xScale);
    if (this.xStart !== null) this.xAxis.tickFormat(formatNum('.1s'));
    this.yAxis = d3
      .axisLeft(this.yScale)
      .ticks(5, 's')
      .tickFormat(formatNum('.1s'));

    const transform =
      chartDiv.clientHeight - this.margin.top - this.margin.bottom - 20;
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + transform + ')'
      )
      .call(this.xAxis);
    this.chart
      .append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  addCrosshairs() {
    const transform =
      chartDiv.clientHeight - this.margin.top - this.margin.bottom - 20;

    const verticalLine = svg
      .append('line')
      .attr('y1', 0)
      .attr('y2', transform)
      .attr('class', 'crosshair verticalLineTop')
      .attr('opacity', 0);
    const horizontalLine = this.chartBody
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('class', 'crosshair');

    const yTextBox = this.chart.append('g').attr('opacity', 0);
    const xTextBox = svg
      .append('g')
      .attr('opacity', 0)
      .attr('class', 'xTextBoxGroup');

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
      .attr('y', transform)
      .attr('width', 100)
      .attr('height', 18)
      .attr('class', 'xTextBox bg');
    const xText = xTextBox
      .append('text')
      .attr('x', 50)
      .attr('y', transform + 13)
      .attr('class', 'xTextBox text');

    verticalLine.on('change', function() {
      const mouse = d3.event.detail;
      const labels = d3.selectAll('.legendCells .cell .label');

      self.data.forEach((datum, idx) => {
        const values = datum.values;
        const bisectDate = d3.bisector(d => d.x).left;
        const x0 = self.new_xScale.invert(mouse[0]);
        const i = bisectDate(values, x0, 1);
        const d0 = values[i - 1];

        if (typeof values[i] != 'undefined') {
          const d1 = values[i];
          const d = x0 - d0.x > d1.x - x0 ? d1 : d0;
          d3.select(labels.nodes()[idx]).text(
            datum.name + ' | ' + formatY(d.y)
          );
        } else {
          d3.select(labels.nodes()[idx]).text(datum.name);
        }
      });
    });

    // update crosshairs
    const formatY = formatNum('.3s');
    const formatX =
      this.xStart === null ? d3.timeFormat("%d %b '%y") : formatNum('.0f');
    const self = this;
    this.chartBody
      .on('mousemove', function() {
        const mouse = d3.mouse(this);

        verticalLine.dispatch('change', { detail: mouse });

        if (self.bottomChart != null)
          self.bottomChart.updateLegendValues(mouse);

        verticalLine
          .attr('x1', mouse[0] + 50)
          .attr('x2', mouse[0] + 50)
          .attr('opacity', 1);
        if (
          self.bottomChart != null &&
          typeof self.bottomChart.verticalLine != 'undefined'
        )
          self.bottomChart.verticalLine
            .attr('x1', mouse[0])
            .attr('x2', mouse[0])
            .attr('opacity', 1);
        horizontalLine
          .attr('y1', mouse[1])
          .attr('y2', mouse[1])
          .attr('opacity', 1);
        xTextBox
          .attr('transform', 'translate(' + mouse[0] + ',0)')
          .attr('opacity', 1);
        yTextBox
          .attr('transform', 'translate(0,' + (mouse[1] - 9) + ')')
          .attr('opacity', 1);
        xText.text(formatX(self.new_xScale.invert(mouse[0])));
        yText.text(formatY(self.new_yScale.invert(mouse[1])));
      })
      .on('mouseout', function() {
        verticalLine.attr('opacity', 0);
        if (
          self.bottomChart != null &&
          typeof self.bottomChart.verticalLine != 'undefined'
        )
          self.bottomChart.verticalLine.attr('opacity', 0);
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
      this.chart.call(this.xyzoom.transform, d3.xyzoomIdentity);
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
          d.x = parseX(d.x, this.xStart);
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
          d.start = parseX(d.start, this.xStart);
          d.end = d.end == null ? new Date() : parseX(d.end, this.xStart);
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
          .cellFilter(function(d) {
            return d.label !== 'e';
          })
          .scale(ordinal)
          .on('cellclick', function(d) {
            const legendCell = d3.select(this);
            const i = ordinal.domain().indexOf(d);
            const datapoint = d3.select('.data.datum' + i);
            datapoint.attr('opacity', 1 - datapoint.attr('opacity'));
            legendCell.classed('hidden', !legendCell.classed('hidden'));
          })
      );

    legendElement.attr(
      'transform',
      'translate(' +
        (this.width - legendElement.node().getBBox().width - 50) +
        ', ' +
        (this.height - legendElement.node().getBBox().height - 20) +
        ')'
    );

    const legendButton = d3.select('#legend');
    legendButton.on('click', () => {
      const opacity = legendButton.classed('selected') ? 0 : 1;
      const newClass = opacity == 1 ? 'selected' : null;
      legendElement.style('opacity', opacity);
      d3.select('.legendOrdinalBottom').style('opacity', opacity);
      legendButton.attr('class', newClass);
    });
  }
}
