const chart = new Chart(
  "Generalized Metcalfe's Law",
  [
    {
      name: 'Generalized Metcalfe\'s Law',
      jsonPath: '../data/normalized/addresses_genmetcalfe.json',
      style: { stroke: DARK_GREEN, strokeWidth: '1px' },
      transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
    },
    {
      name: 'Market capitalization (USD)',
      jsonPath: '../data/marketcap.json',
      style: { stroke: BLUE, strokeWidth: '2px' },
      transition: { ease: d3.easeQuadInOut, delay: 0, duration: 2000 }
    }
  ]
);
chart.show([10000, 1e12], [0, 5e11]);
