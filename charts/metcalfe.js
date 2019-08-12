const chart = new Chart("Metcalfe's Law (Transactions vs Market Cap)", [
  {
    name: 'Transactions excluding popular addresses squared',
    jsonPath: '../data/normalized/transactions_squared.json',
    style: { stroke: DARK_GREEN, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 5000 }
  },
  {
    name: 'Market capitalization (USD)',
    jsonPath: '../data/marketcap.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 1000, duration: 5000 }
  },
  {
    name: 'Power regression on transactions y = 0.007x^2.224',
    containsBounds: true,
    jsonPath: '../data/regressions/transactions_power_squared.json',
    style: { stroke: RED, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 6000, duration: 1000 }
  }
]);
chart.show([10000, 1e14], [0, 8e12]);
