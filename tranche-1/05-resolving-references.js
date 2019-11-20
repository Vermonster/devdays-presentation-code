const fs = require('fs');
const readlineSync = require('readline-sync');
const { client, dump } = require('../lib/utils');

const { id = '0488ce70-f68d-45fb-b6a5-29684d0e4f35' } = process.env;

async function main () {
  readlineSync.question('Absolute, a full URL to a resource... ');

  let resolved = await client
    .resolve({ reference: 'https://r3.smarthealthit.org/Patient/eb3271e1-ae1b-4644-9332-41e32c829486' })
    .catch(e => console.log(dump(e)));
  console.log(dump(resolved.name));

  readlineSync.question('Relative to the base URL we used when making the client... ');

  resolved = await client
    .resolve({ reference: `Patient/${id}` })
    .catch(e => console.log(dump(e)));
  console.log(dump(resolved.name));

  readlineSync.question('Bundle, where the patient is found... ');

  const contextJson = fs.readFileSync('./bundle-collection.json', 'utf8');
  const context = JSON.parse(contextJson);

  resolved = await client
    .resolve({ reference: 'Patient/23', context })
    .catch(e => console.log(dump(e)));
  console.log(dump(resolved.name));

  readlineSync.question('Bundle, where the patient is not found... ');
  resolved = await client.resolve({ reference: 'Patient/835a3b08-e3b6-49c4-a23f-1fac8dc7a7a7', context });
  console.log(dump(resolved.name));

  readlineSync.question('Contained within a resource... ');

  const containedJson = fs.readFileSync('./contained-resource.json', 'utf8');
  const contained = JSON.parse(containedJson);

  resolved = await client
    .resolve({ reference: '#p1', context: contained })
    .catch(e => console.log(dump(e)));
  console.log(dump(resolved.name));
}

if (require.main === module) { main(); }
