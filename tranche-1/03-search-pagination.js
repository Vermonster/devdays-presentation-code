const { client, dump } = require('../lib/utils');

const { id = '0488ce70-f68d-45fb-b6a5-29684d0e4f35' } = process.env;

const entries = [];

client
  .search({
    resourceType: 'Observation',
    searchParams: { patient: id, _include: ['Observation:performer'] }
  })
  .then(bundle => {
    entries.push.apply(entries, bundle.entry);
    console.log(dump(entries.length));
    return client.nextPage({ bundle });
  })
  .then(bundle => {
    entries.push.apply(entries, bundle.entry);
    console.log(dump(entries.length));
    return client.nextPage({ bundle });
  })
  .then(bundle => {
    entries.push.apply(entries, bundle.entry);
    console.log(dump(entries.length));
  })
  .catch(error => console.error(dump(error)));
