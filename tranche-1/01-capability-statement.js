const { client, dump } = require('../lib/utils');

client
  .capabilityStatement()
  .then(data => console.log(dump(data)));
