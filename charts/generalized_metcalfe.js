const chart = new Chart(
  "Generalized Metcalfe's Law (Addresses vs Market Cap)",
  [
    {
      name: 'Generalized Metcalfe function (given active addresses)',
      jsonPath: '../data/normalized/addresses_genmetcalfe.json',
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
      name: 'Power regression on addresses y = 0.0012x^2.5847',
      containsBounds: true,
      jsonPath: '../data/regressions/addresses_power_genmetcalfe.json',
      style: { stroke: RED, strokeWidth: '2px' },
      transition: { ease: d3.easeQuadInOut, delay: 6000, duration: 1000 }
    }
  ]
);
chart.show([100, 1e14], [0, 8e12]);
