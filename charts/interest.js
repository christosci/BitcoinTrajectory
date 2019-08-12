const chart = new Chart('Price vs Google Search Interest', [
  {
    name: 'Monthly search interest (scaled)',
    jsonPath: '../data/normalized/interest_scaled.json',
    style: { stroke: BLUE_GREEN, strokeWidth: '2px' },
    transition: { ease: d3.easeQuadInOut, delay: 1000, duration: 5000 }
  },
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: GOLD, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 5000 }
  }
]);
chart.show([0.01, 1e5], [-10000, 30000]);
