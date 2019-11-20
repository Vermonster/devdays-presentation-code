const util = require('util');
const { inspect } = util;

// Object inspection
function dump (obj) {
  const options = {
    depth: 5,
    compact: true,
    maxArrayLength: 5,
    colors: true
  };

  return inspect(obj, options);
}

// Client class
const FhirKitClient = require('fhir-kit-client');

// Make a client object
const { ISS: baseUrl = 'https://r4.smarthealthit.org' } = process.env;
const customHeaders = { 'content-type': 'application/fhir+json' };
const client = new FhirKitClient({ baseUrl, customHeaders });

module.exports = { FhirKitClient, client, dump };
