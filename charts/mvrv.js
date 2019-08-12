const chart = new Chart('Market Value vs Realized Value', [
  {
    name: 'Market capitalization (USD)',
    jsonPath: '../data/marketcap.json',
    style: { stroke: BLUE, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 5000 }
  },
  {
    name: 'Realized capitalization',
    jsonPath: '../data/realizedcap.json',
    style: { stroke: GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 1000, duration: 5000 }
  }
]);
chart.show([100, 1e12], [0, 5e11]);
