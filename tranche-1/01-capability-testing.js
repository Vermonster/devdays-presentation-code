const { client } = require('../lib/utils');
const CapabilityTool = require('fhir-kit-client/lib/capability-tool');

const main = async () => {
  const capabilityStatement = await client.capabilityStatement();
  const capabilities = new CapabilityTool(capabilityStatement);

  console.log(`can transaction: ${capabilities.serverCan('transaction')}`);
  console.log(`can history-system: ${capabilities.serverCan('history-system')}`);
  console.log(`can search-system: ${capabilities.serverCan('search-system')}`);
  console.log(`can batch: ${capabilities.serverCan('batch')}`);

  console.log('---');

  console.log(`can read Patient: ${capabilities.resourceCan('Patient', 'read')}`);
  console.log(`can patch Patient: ${capabilities.resourceCan('Patient', 'patch')}`);

  console.log('---');

  console.log(`can search Patient.gender: ${capabilities.resourceSearch('Patient', 'gender')}`);
  console.log(`can search CareTeam.patient: ${capabilities.resourceSearch('CareTeam', 'patient')}`);
};

if (require.main === module) { main(); }
