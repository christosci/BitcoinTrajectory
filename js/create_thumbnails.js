const minJsonPaths = [
  'data-min/normalized/transactions_squared.json',
  'data-min/marketcap.json',
  'data-min/normalized/addresses_genmetcalfe.json',
  'data-min/price.json',
  'data-min/realizedcap.json',
  'data-min/regressions/trolololo_log.json',
  'data-min/regressions/power_law.json',
  'data/normalized/stock_flow.json',
  'data/normalized/interest_scaled.json',
  'data/normalized/daily_log_returns.json',
  'data-min/normalized/metcalfe_multiple.json',
  'data-min/fear_greed.json',
  'data-min/volume.json'
];
var q = d3.queue();
minJsonPaths.forEach(path => {
  q.defer(d3.json, path);
});

q.awaitAll((error, args) => {
  if (error) throw error;

  values = {};
  args.forEach((d, i) => {
    const v = parseJson(d);
    values[d.short_name] = v;
  });

  new Thumbnail(
    'thumbnail-metcalfe',
    [
      {
        values: values.transactions_squared,
        style: { stroke: DARK_GREEN, strokeWidth: '1px' }
      },
      {
        values: values.marketcap,
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  ).show();

  new Thumbnail(
    'thumbnail-metcalfemultiple',
    [
      {
        values: values.metcalfe_multiple,
        style: { stroke: "GOLD", strokeWidth: '1px' }
      }
    ]
  ).show(d3.scaleLinear());

  new Thumbnail(
    'thumbnail-genmetcalfe',
    [
      {
        values: values.addresses_genmetcalfe,
        style: { stroke: DARK_GREEN, strokeWidth: '1px' }
      },
      {
        values: values.marketcap,
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ],
  ).show();

  new Thumbnail(
    'thumbnail-mvrv',
    [
      {
        values: values.realizedcap,
        style: { stroke: DARK_GREEN, strokeWidth: '2px' }
      },
      {
        values: values.marketcap,
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  ).show();

  new Thumbnail(
    'thumbnail-sf',
    [
      {
        values: values.stock_flow,
        style: { stroke: DARK_GREEN, strokeWidth: '2px' }
      },
      {
        values: values.price,
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  ).show();

  new Thumbnail(
    'thumbnail-trolololo',
    [
      {
        values: values.price,
        style: { stroke: GREEN, strokeWidth: '2px' }
      },
      {
        values: values.trolololo_log,
        style: { stroke: RED, strokeWidth: '2px' }
      }
    ]
  ).show();
  
  new Thumbnail(
    'thumbnail-interest',
    [
      {
        values: values.interest_scaled,
        style: { stroke: BLUE_GREEN, strokeWidth: '3px' }
      },
      {
        values: values.price,
        style: { stroke: GOLD, strokeWidth: '1px' }
      }
    ]
  ).show(d3.scaleLinear(), -100);

  new Thumbnail(
    'thumbnail-powerlaw',
    [
      {
        values: values.price,
        style: { stroke: GREEN, strokeWidth: '2px' }
      },
      {
        values: values.power_law,
        style: { stroke: RED, strokeWidth: '2px' }
      }
    ]
  ).show(d3.scaleLog(), null, 1230940800);

  new Thumbnail(
    'thumbnail-dailylogreturns',
    [
      {
        values: values.daily_log_returns,
        style: { stroke: BLUE_GREEN, strokeWidth: '1px' }
      }
    ]
  ).show(d3.scaleLinear(), -1);

  new Thumbnail(
    'thumbnail-feargreed',
    [
      {
        values: values.fear_greed,
        style: { stroke: GOLD, strokeWidth: '1px' }
      }
    ]
  ).show(d3.scaleLinear());

  new Thumbnail(
    'thumbnail-volume',
    [
      {
        values: values.volume,
        style: { stroke: BLUE_GREEN, strokeWidth: '2px' }
      }
    ]
  ).show(d3.scaleLinear());
});
