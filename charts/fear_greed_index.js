const chart = new Chart('Fear and Greed Index', [
  {
    name: 'Market price (USD)',
    jsonPath: '../data/price.json',
    style: { stroke: BLUE, strokeWidth: '2px' },
    transition: { ease: d3.easeLinear, delay: 0, duration: 2000 }
  }
]);

const bottomChart = new BottomChart(
  'Fear and Greed Index',
  [
    {
      name: 'Fear and Greed Index',
      jsonPath: '../data/fear_greed.json',
      style: { stroke: GOLD, strokeWidth: '1px' },
      transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
    }
  ],
  [
    {
      type: 'line',
      y: '50',
      color: '#ff0000'
    }
  ]
);

chart.setBottomChart(bottomChart, [0, 100]);
chart.show([1000, 50000], [-5000, 30000], null, 1506816000);

