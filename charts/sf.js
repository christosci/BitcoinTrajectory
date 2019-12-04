const chart = new Chart('Stock to Flow', [
  {
    name: '0.4 * SF ^ 3',
    jsonPath: '../data/normalized/stock_flow.json',
    style: { stroke: DARK_GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
  },
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 500, duration: 2000 }
  }
]);
chart.show([0.01, 1e8], [0, 500000]);
