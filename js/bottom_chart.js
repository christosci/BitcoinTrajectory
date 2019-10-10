const bottomChartDiv = document.getElementById('bottom-chart');
let svgBottom = d3.select(bottomChartDiv).append('svg');

class BottomChart {
  constructor(title, data, annotations) {
    this.title = title;
    this.data = data;
    this.annotations = annotations;
  }

  show(yDomain) {
    // show bottom chart div
    d3.select(bottomChartDiv).attr('class', 'bottom-chart-show');
    this.yDomain = yDomain;

    const q = d3.queue();
    this.data.forEach(d => {
      q.defer(d3.json, d.jsonPath);
    });

    q.awaitAll((error, args) => {
      if (error) throw error;

      args.forEach((d, i) => {
        let values = parseJson(d, this.data[i].containsBounds);
        this.data[i].values = values;
      });
      this.draw();
    });
  }

  draw(resize = false) {
    if (resize) {
      svgBottom.remove();
      svgBottom = d3.select(bottomChartDiv).append('svg');
    }
    this.margin = { top: 5, right: 50, bottom: 0, left: 50 };
    this.clientWidth = bottomChartDiv.clientWidth;
    this.clientHeight = bottomChartDiv.clientHeight;
    this.width = this.clientWidth - this.margin.left - this.margin.right;
    this.height = this.clientHeight - this.margin.top - this.margin.bottom;

    this.createCanvas();
    if (!resize) {
      this.createScales();
    } else {
      this.resizeScales();
    }
    this.addAxes();
    this.addGridlines();
    this.addLines(resize);
    this.addCrosshairs();
    this.addLegend();
    this.addAnnotations();
    this.addDivider();
  }

  createCanvas() {
    svgBottom.attr('width', this.clientWidth).attr('height', this.clientHeight);

    const newZoom = handler =>
      d3
        .zoom()
        .wheelDelta(
          () => (-d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)) / 2000
        )
        .on('zoom', handler);

    this.yzoom = newZoom(this.yzoomed());

    this.chart = svgBottom
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .attr('class', 'chart');

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
      svgBottom
        .append('svg:rect')
        .attr('id', id)
        .attr('width', w)
        .attr('height', h)
        .attr('transform', 'translate(' + x + ',' + y + ')')
        .attr('opacity', '0')
        .attr('pointer-events', 'all')
        .call(zoom);

    this.yrect = newZoomRect(
      'yZoomRect',
      0,
      this.margin.top,
      this.margin.left,
      this.height,
      this.yzoom
    );
  }

  yzoomed() {
    return () => {
      this.new_yScale = d3.event.transform.rescaleY(this.yScale);

      const plotLine = d3
        .line()
        .x(d => this.new_xScale(d.x))
        .y(d => this.new_yScale(d.y));
      this.data.forEach(d => {
        d.path
          .datum(d.values)
          .attr('d', plotLine)
          .attr('stroke-dasharray', 0);
      });

      this.annotations.forEach(a =>
        a.path.remove()
      );
      this.addAnnotations();

      this.chart.select('.y.grid').call(
        d3
          .axisLeft(this.new_yScale)
          .ticks(5)
          .tickSize(-this.width)
          .tickFormat('')
      );
      this.chart.select('.y.axis').call(this.yAxis.scale(this.new_yScale));
    };
  }

  createScales() {
    this.xScale = d3.scaleTime();
    this.xScale.domain(this.xDomain).range([0, this.width]);
    this.yScale = d3
      .scaleLinear()
      .domain(this.yDomain)
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
        .attr('class', 'data bottom line datum' + i)
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
    this.yAxis = d3
      .axisLeft(this.yScale)
      .ticks(5, 's')
      .tickFormat(formatNum('.1f'));
    this.chart
      .append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  addCrosshairs() {
    const transform = chartDiv.clientHeight - 70;

    const verticalLineTop = svg
      .append('line')
      .attr('y1', 0)
      .attr('y2', chartDiv.clientHeight - 100)
      .attr('class', 'crosshair')
      .attr('opacity', 0);
    this.verticalLine = this.chartBody
      .append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('class', 'crosshair');
    const horizontalLine = this.chartBody
      .append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('class', 'crosshair')
      .attr('opacity', 0); // hidden at start in case mousemoves in main chart

    const yTextBox = this.chart.append('g').attr('opacity', 0);
    const xTextBox = svg.append('g').attr('opacity', 0);

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

    // update crosshairs
    const formatY = formatNum('.3f');
    const formatX = d3.timeFormat("%d %b '%y");
    const self = this;
    this.chartBody
      .on('mousemove', function() {
        const mouse = d3.mouse(this);
        const labels = d3.selectAll(
          '.legendOrdinalBottom .legendCells .cell .label'
        );

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
        verticalLineTop
          .attr('x1', mouse[0] + 50)
          .attr('x2', mouse[0] + 50)
          .attr('opacity', 1);
        self.verticalLine
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
        verticalLineTop.attr('opacity', 0);
        self.verticalLine.attr('opacity', 0);
        horizontalLine.attr('opacity', 0);
        xTextBox.attr('opacity', 0);
        yTextBox.attr('opacity', 0);
      });
  }

  addLegend() {
    const ordinal = d3
      .scaleOrdinal()
      .domain(this.data.map(d => d.name))
      .range(this.data.map(d => d.style.stroke));

    const legendElement = this.chart
      .append('g')
      .attr('class', 'legendOrdinalBottom')
      .call(
        d3
          .legendColor()
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
            const datapoint = d3.select('.data.bottom.datum' + i);
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
  }

  addAnnotations() {
    if (this.annotations != null)
      this.annotations.forEach(a => {
        if (a.type == 'line') {
          if (a.y != null) a.path = this.addHorizontalLine(a.y, a.color);
          else a.path = this.addVerticalLine(a.x, a.color);
        }
      });
  }

  addHorizontalLine(y, color = '#fff') {
    return this.chartBody
      .append('line')
      .attr('stroke', color)
      .attr('x1', 0)
      .attr('y1', this.new_yScale(y))
      .attr('x2', this.width)
      .attr('y2', this.new_yScale(y));
  }

  addVerticalLine(x, color = '#fff') {
    return this.chartBody
      .append('line')
      .attr('stroke', color)
      .attr('x1', this.new_xScale(x))
      .attr('y1', 0)
      .attr('x2', this.new_xScale(x))
      .attr('y2', this.height);
  }

  addDivider() {
    this.chartBody
      .append('line')
      .attr('class', 'divider')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.width)
      .attr('y2', 0);
  }

  zoomHandler(t) {
    this.new_xScale = t.rescaleX(this.xScale);
    const plotLine = d3
      .line()
      .x(d => this.new_xScale(d.x))
      .y(d => this.new_yScale(d.y));

    this.data.forEach(d => {
      d.path
        .datum(d.values)
        .attr('d', plotLine)
        .attr('stroke-dasharray', 0);
    });
    this.chart.select('.x.grid').call(
      d3
        .axisBottom(this.new_xScale)
        .tickSize(-this.height)
        .tickFormat('')
    );
  }
}
