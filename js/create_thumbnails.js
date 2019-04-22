const minJsonPaths = [
  'data-min/normalized/transactions_squared.json',
  'data-min/marketcap.json',
  'data-min/normalized/addresses_genmetcalfe.json',
  'data-min/normalized/transactions_m2.json',
  'data-min/price.json',
  'data-min/realizedcap.json',
  'data-min/regressions/trolololo_log.json',
  'data-min/regressions/power_law.json'
];
var q = d3.queue();
minJsonPaths.forEach(path => {
  q.defer(d3.json, path);
});

q.awaitAll((error, args) => {
  if (error) throw error;

  values = [];
  args.forEach((d, i) => {
    const v = parseJson(d);
    values[i] = v;
  });

  const thumbnail1 = new Thumbnail(
    'thumbnail-1',
    [
      {
        values: values[0],
        style: { stroke: DARK_GREEN, strokeWidth: '1px' }
      },
      {
        values: values[1],
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  );
  thumbnail1.show();

  const thumbnail2 = new Thumbnail(
    'thumbnail-2',
    [
      {
        values: values[2],
        style: { stroke: DARK_GREEN, strokeWidth: '1px' }
      },
      {
        values: values[1],
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ],
  );
  thumbnail2.show();

  const thumbnail3 = new Thumbnail(
    'thumbnail-3',
    [
      {
        values: values[3],
        style: { stroke: DARK_GREEN, strokeWidth: '1px' }
      },
      {
        values: values[4],
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  );
  thumbnail3.show();

  const thumbnail4 = new Thumbnail(
    'thumbnail-4',
    [
      {
        values: values[5],
        style: { stroke: DARK_GREEN, strokeWidth: '2px' }
      },
      {
        values: values[1],
        style: { stroke: BLUE, strokeWidth: '2px' }
      }
    ]
  );
  thumbnail4.show();

  const thumbnail5 = new Thumbnail(
    'thumbnail-5',
    [
      {
        values: values[4],
        style: { stroke: GREEN, strokeWidth: '2px' }
      },
      {
        values: values[6],
        style: { stroke: RED, strokeWidth: '2px' }
      }
    ]
  );
  thumbnail5.show();

  const thumbnail6 = new Thumbnail(
    'thumbnail-6',
    [
      {
        values: values[4],
        style: { stroke: GREEN, strokeWidth: '2px' }
      },
      {
        values: values[7],
        style: { stroke: RED, strokeWidth: '2px' }
      }
    ]
  );
  thumbnail6.show(d3.scaleLog(), null, 1230940800);
});
