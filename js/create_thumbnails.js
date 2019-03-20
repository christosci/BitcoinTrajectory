const minJsonPaths = [
  'data-min/normalized/transactions_squared.json',
  'data-min/marketcap.json',
  'data-min/normalized/addresses_genmetcalfe.json',
  'data-min/normalized/transactions_m2.json',
  'data-min/price.json',
  'data-min/realizedcap.json',
  'data-min/regressions/trolololo_log.json'
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
        style: { stroke: '#13a038', strokeWidth: '1px' }
      },
      {
        values: values[1],
        style: { stroke: '#33ccff', strokeWidth: '2px' }
      }
    ],
    d3.scaleLog()
  );
  thumbnail1.show();

  const thumbnail2 = new Thumbnail(
    'thumbnail-2',
    [
      {
        values: values[2],
        style: { stroke: '#13a038', strokeWidth: '1px' }
      },
      {
        values: values[1],
        style: { stroke: '#33ccff', strokeWidth: '2px' }
      }
    ],
    d3.scaleLog(),
    80000
  );
  thumbnail2.show();

  const thumbnail3 = new Thumbnail(
    'thumbnail-3',
    [
      {
        values: values[3],
        style: { stroke: '#147b71', strokeWidth: '1px' }
      },
      {
        values: values[4],
        style: { stroke: '#ccbc0f', strokeWidth: '2px' }
      }
    ],
    d3.scaleLog()
  );
  thumbnail3.show();

  const thumbnail4 = new Thumbnail(
    'thumbnail-4',
    [
      {
        values: values[5],
        style: { stroke: '#33ccff', strokeWidth: '2px' }
      },
      {
        values: values[1],
        style: { stroke: '#2ce65f', strokeWidth: '2px' }
      }
    ],
    d3.scaleLog()
  );
  thumbnail4.show();

  const thumbnail5 = new Thumbnail(
    'thumbnail-5',
    [
      {
        values: values[4],
        style: { stroke: '#2ce65f', strokeWidth: '2px' }
      },
      {
        values: values[6],
        style: { stroke: '#ee0000', strokeWidth: '2px' }
      }
    ],
    d3.scaleLog()
  );
  thumbnail5.show();
});
