const chart = new Chart('Logarithmic Regression (Trolololo v2.3)', [
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 0, duration: 3000 }
  },
  {
    name: 'y = 2.6617 ln(x) - 17.9184',
    jsonPath: '../data/regressions/trolololo_log.json',
    style: { stroke: RED, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 3000, duration: 3000 }
  }
]);
chart.show([0.00001, 1e6], [0, 1e5]);
