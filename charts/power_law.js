const chart = new Chart('Power Law', [
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 0, duration: 1500 }
  },
  {
    name: 'y = 3.4896e-18(x)^5.9762',
    jsonPath: '../data/regressions/power_law.json',
    style: { stroke: RED, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 1500, duration: 1000 }
  }
]);
chart.show([0.01, 1e6], [0, 1e5], 1230940800);
