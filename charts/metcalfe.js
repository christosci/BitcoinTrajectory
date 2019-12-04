const chart = new Chart("Metcalfe's Law (Transactions vs Market Cap)", [
  {
    name: 'Transactions excluding popular addresses squared',
    jsonPath: '../data/normalized/transactions_squared.json',
    style: { stroke: DARK_GREEN, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
  },
  {
    name: 'Market capitalization (USD)',
    jsonPath: '../data/marketcap.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 500, duration: 2500 }
  }
]);
chart.show([10000, 1e12], [0, 8e12]);
