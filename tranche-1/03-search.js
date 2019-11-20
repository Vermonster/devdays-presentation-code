const { client, dump } = require('../lib/utils');

const { id = '0488ce70-f68d-45fb-b6a5-29684d0e4f35' } = process.env;

client
  .search({
    resourceType: 'Observation',
    searchParams: { patient: id, _include: ['Observation:performer'] }
  })
  .then(data => console.log(dump(data)))
  .catch(error => console.error(dump(error)));
