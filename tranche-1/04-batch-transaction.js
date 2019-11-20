const fs = require('fs');
const { client, dump } = require('../lib/utils');

const bundleJson = fs.readFileSync('./bundle-transaction.json', 'utf8');
const bundle = JSON.parse(bundleJson);

client
  .batch({ body: bundle })
  .then(data => console.log(dump(data)))
  .catch(error => console.error(dump(error)));
