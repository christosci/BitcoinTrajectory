const chart = new Chart('Logarithmic Regression (Trolololo v2.3)', [
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 0, duration: 1000 }
  },
  {
    name: 'y = 2.6617 ln(x) - 17.9184',
    jsonPath: '../data/regressions/trolololo_log.json',
    style: { stroke: RED, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 500, duration: 2000 }
  }
]);
chart.show([0.01, 1e6], [0, 1e5]);
