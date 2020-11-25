const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const crowdFundingPath = path.resolve(
  __dirname,
  'contracts',
  'CrowdFunding.sol'
);
const source = fs.readFileSync(crowdFundingPath, 'utf8');
console.log(source);
const output = solc.compile(source, 1).contracts;

console.log('output', output);

fs.ensureDirSync(buildPath); //directory sync ensure
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}
