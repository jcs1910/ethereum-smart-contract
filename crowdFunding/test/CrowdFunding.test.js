const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCrowdFunding = require('../ethereum/build/CrowdFunding.json');
const compiledCrowdFundingFactory = require('../ethereum/build/CrowdFundingFactory.json');

let accounts;
let factory;
let crowdFunding;
let crowdFundingAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFundingFactory.interface)
  )
    .deploy({
      data: compiledCrowdFundingFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });

  await factory.methods
    .createCrowdFunding('1')
    .send({ from: accounts[0], gas: '1000000' });

  [
    crowdFundingAddress,
  ] = await factory.methods.getDeployedCrowdFundings().call();
  console.log('crowdFudingAddress', crowdFundingAddress);

  crowdFunding = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFunding.interface),
    crowdFundingAddress
  );
  console.log('crowdFunding.options.address', crowdFunding);
});

describe('CrowdFunding', () => {
  it('deploys a crowdFundingfactory and a crowdFunding', () => {
    assert.ok(factory.options.address);
  });
  it('deploys a crowdFunding', () => {
    assert.ok(crowdFunding.options.address);
  });
});
