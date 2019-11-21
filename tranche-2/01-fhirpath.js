const fhirpath = require('fhirpath');

const { client, dump } = require('../lib/utils');

const { id = '0488ce70-f68d-45fb-b6a5-29684d0e4f35' } = process.env;

client
  .read({ resourceType: 'Patient', id })
  .then((data) => {
    console.log(dump(data.identifier));
    console.log("\n---\n");

    let path = "Patient.identifier.where( system = 'urn:oid:2.16.840.1.113883.4.3.25' ).value.first()";
    console.log(path);
    console.log(fhirpath.evaluate(data, path));

    console.log("\n---\n");

    path = "Patient.identifier.where( system = 'urn:oid:2.16.840.1.113883.4.3.25' ).select('Driver License: ' + value)";
    console.log(path);
    console.log(fhirpath.evaluate(data, path));
  })
  .catch(error => console.error(dump(error)));
