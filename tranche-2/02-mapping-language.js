const Engine = require('fhir-kit-mapping-language');
const { dump } = require('../lib/utils');

// Make 2 maps
const map1 = `map "http://test.com/1" = test1

imports "http://test.com/2"

group example(source src, target tgt) {
  src.name as vn -> tgt.name as tn then {
    vn.firstName as g -> tn.firstName = g;
    vn.lastName as ln -> tn.familyName = ln;
  };
  src.address as sa -> tgt.address as ta then address(sa, ta);
}
`;

const map2 = `map "http://test.com/2" = test2

group address(source src, target tgt) {
  src.street as s -> tgt.street = s;
}
`;

const maps = [map1, map2];

// Create a new engine with two maps
const engine = new Engine(maps);

// Setup inputs and execute with the specified map
const inputs = [
  {
    name: { firstName: 'bob', lastName: 'smith' },
    address: { street: '123 Main St' }
  }
];
const targets = engine.execute('http://test.com/1', inputs);

console.log('Inputs...');
console.log(dump(inputs));

console.log('---');

console.log('maps...');
maps.forEach(m => console.log(m));

console.log('---');

console.log('Targets...');
console.log(targets);
