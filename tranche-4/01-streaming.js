const fetch = require('node-fetch');
const stream = require('stream');
const ndjson = require('ndjson');

// Wrapper around Node streams...
const through = require('through2');

// Treat http requests as a streaming transport
const hyperquest = require('hyperquest');

const { dump } = require('../lib/utils');

const { pipeline } = stream;

// ---

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

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
    .catch(err => console.log(`error: ${dump(err)}`));
}

// ---

function write (row, enc, next) {
  next(null, String(row.id) + '\n');
}

function streamDownload (files = []) {
  files.forEach(file => {
    pipeline(
      hyperquest(file, { headers: { accept: 'application/fhir+json' } }),
      ndjson.parse(),
      through.obj(write),
      process.stdout
    );
  });
}

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
  .catch(err => console.log(`error: ${dump(err)}`));
