const chart = new Chart('Metcalfe Multiple', [
  {
    name: 'Transactions excluding popular addresses squared divided by supply',
    jsonPath: '../data/normalized/metcalfe_price.json',
    style: { stroke: DARK_GREEN, strokeWidth: '1px' },
    transition: { ease: d3.easeQuadInOut, delay: 0, duration: 3000 }
  },
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 0, duration: 3000 }
  }
]);

const bottomChart = new BottomChart(
  'Log Returns',
  [
    {
      name: 'Metcalfe multiple (price / n2)',
      jsonPath: '../data/normalized/metcalfe_multiple.json',
      style: { stroke: GOLD, strokeWidth: '1px' },
      transition: { ease: d3.easeQuadInOut, delay: 0, duration: 3000 }
    }
  ],
  [
    {
      type: 'line',
      y: '1',
      color: '#ff0000'
    }
  ]
);

chart.setBottomChart(bottomChart, [-2, 15]);
chart.show([0.01, 50000], [-5000, 30000], null);

