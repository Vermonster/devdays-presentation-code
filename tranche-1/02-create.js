const { client, dump } = require('../lib/utils');

const newPatient = {
  resourceType: 'Patient',
  active: true,
  name: [{ use: 'official', family: ['Coleman'], given: ['Lisa', 'P.'] }],
  gender: 'female',
  birthDate: '1948-04-14'
};

client
  .create({ resourceType: 'Patient', body: newPatient })
  .then(data => console.log(dump(data)))
  .catch(error => console.error(dump(error)));
