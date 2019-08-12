const chart = new Chart('M2 vs Market Price', [
  {
    name: 'M2',
    jsonPath: '../data/normalized/transactions_m2.json',
    style: { stroke: DARK_GREEN, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 5000 }
  },
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 1000, duration: 5000 }
  }
]);
chart.show([0.01, 100000], [0, 25000]);
