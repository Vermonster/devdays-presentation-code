const fetch = require('node-fetch');
const stream = require('stream');
const ndjson = require('ndjson');

// A wrapper around Node streams...
const through = require('through2');

// Treat http requests as a streaming transport
const hyperquest = require('hyperquest');


// ============================================================================
// Functions to check the status of the trigger and wait until for
// dowload link(s)
//
async function waitForFiles (url) {
  await sleep(1000);

  return fetch(url)
    .then(res => {
      const { status, headers } = res;
      if (status === 202) {
        console.log(`* waiting... ${headers.get('x-progress')}`);
        return waitForFiles(url);
      }
      return res.json();
    })
    .catch(err => console.log(err));
}

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// ============================================================================
// Create a stream pipeline that streams:
// * The HTTP request to download the file
// * ndjson parsing
// * calls a writer function
// * stream to stdout

function streamDownload (files = []) {
  const { pipeline } = stream;

  files.forEach(file => {
    pipeline(
      hyperquest(file, { headers: { accept: 'application/fhir+json' } }),
      ndjson.parse(),
      through.obj(write),
      process.stdout
    );
  });
}

function write (row, enc, next) {
  next(null, String(row.id) + '\n');
}


// ============================================================================
// Finally, kick the whole thing off:

const triggerLink = 'https://bulk-data.smarthealthit.org/eyJlcnIiOiIiLCJwYWdlIjoxMDAwMCwiZHVyIjoxMCwidGx0IjoxNSwibSI6MTAwLCJzdHUiOjN9/fhir/Group/1/$export?_type=Condition';

const headers = {
  Accept: 'application/fhir+json',
  Prefer: 'respond-async'
};

fetch(triggerLink, { headers })
  .then(res => waitForFiles(res.headers.get('content-location')))
  .then(json => {
    if (json && Array.isArray(json.output)) {
      return json.output.map(f => f.url);
    }
  })
  .then(files => streamDownload(files))
  .catch(err => conole.log(err));
