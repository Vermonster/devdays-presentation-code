const { client, FhirKitClient, dump } = require('../lib/utils');

const { id = '0488ce70-f68d-45fb-b6a5-29684d0e4f35' } = process.env;

client
  .read({ resourceType: 'Patient', id })
  .then((data) => {
    console.log(dump(data));
    const { response, request } = FhirKitClient.httpFor(data);

    console.log(dump(response.status));
    console.log('----');
    console.log(dump(request.headers));
  })
  .catch(error => console.error(dump(error)));
