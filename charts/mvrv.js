const chart = new Chart('Market Value vs Realized Value', [
  {
    name: 'Market capitalization (USD)',
    jsonPath: '../data/marketcap.json',
    style: { stroke: BLUE, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
  },
  {
    name: 'Realized capitalization',
    jsonPath: '../data/realizedcap.json',
    style: { stroke: GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 500, duration: 2000 }
  }
]);
chart.show([10000, 1e12], [0, 5e11]);
