const chart = new Chart('Commitment of Traders', [
    {
      name: 'Market price (USD)',
      jsonPath: '../data/price.json',
      style: { stroke: BLUE, strokeWidth: '2px' },
      transition: { ease: d3.easeLinear, delay: 0, duration: 2000 }
    }
  ]);
  
  const bottomChart = new BottomChart(
    'COT - CME BTC Futures',
    [
      {
        name: 'Dealer',
        jsonPath: '../data/dealer_ratio.json',
        style: { stroke: GOLD, strokeWidth: '1px' },
        transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
      },
      {
        name: 'Asset Manager/Institutional',
        jsonPath: '../data/assetmngr_ratio.json',
        style: { stroke: RED, strokeWidth: '1px' },
        transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
      },
      {
        name: 'Leveraged Funds',
        jsonPath: '../data/funds_ratio.json',
        style: { stroke: GREEN, strokeWidth: '1px' },
        transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
      }
    ],
    [
      {
        type: 'line',
        y: '0',
        color: '#555'
      }
    ]
  );
  
  chart.setBottomChart(bottomChart, [-2000, 1000]);
  chart.show([1000, 50000], [-5000, 30000], null, 1506816000);
  
  