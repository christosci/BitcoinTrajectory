const chart = new Chart('Price vs Volume', [
    {
      name: 'Market price (USD)',
      jsonPath: '../data/price.json',
      style: { stroke: GOLD, strokeWidth: '2px' },
      transition: { ease: d3.easeLinear, delay: 0, duration: 2000 }
    }
  ]);
  
  const bottomChart = new BottomChart(
    'Fear and Greed Index',
    [
      {
        name: 'Trade Volume (USD)',
        jsonPath: '../data/volume.json',
        style: { stroke: BLUE_GREEN, strokeWidth: '1px' },
        transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
      }
    ]
  );
  
  chart.setBottomChart(bottomChart, [0, 6e9]);
  chart.show([0.01, 50000], [-5000, 30000], null);
  
  