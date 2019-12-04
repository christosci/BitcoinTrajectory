const chart = new Chart('Price vs Google Search Interest', [
  {
    name: 'Monthly search interest (scaled)',
    jsonPath: '../data/normalized/interest_scaled.json',
    style: { stroke: BLUE_GREEN, strokeWidth: '3px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
  },
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: GOLD, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
  }
]);
chart.show([10, 40000], [-10000, 30000], null, 1356998400);
