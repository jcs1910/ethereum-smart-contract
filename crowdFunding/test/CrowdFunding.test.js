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
    .createCrowdFunding('10000') // wei로 전달
    .send({
      from: accounts[0],
      gas: '1000000',
    });

  [
    crowdFundingAddress,
  ] = await factory.methods.getDeployedCrowdFundings().call();

  crowdFunding = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFunding.interface),
    crowdFundingAddress
  );
});

describe('CrowdFunding', () => {
  it('deploys a crowdFundingfactory and a crowdFunding', () => {
    assert.ok(factory.options.address);
  });
  it('deploys a crowdFunding', () => {
    assert.ok(crowdFunding.options.address);
  });

  it('verifies whether the crowdFunding manager is a correct person', async () => {
    const manager = await crowdFunding.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribue money and marks them as contributors', async () => {
    await crowdFunding.methods.contribute().send({
      value: '10001',
      from: accounts[1],
    });
    const isContributor = await crowdFunding.methods
      .contributors(accounts[1])
      .call();

    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await crowdFunding.methods.contribute().send({
        value: '1000',
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a paymenet request', async () => {
    await crowdFunding.methods
      .createRequest('Buy a car', '100000', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    const request = await crowdFunding.methods.requests(0).call();
    assert.equal('Buy a car', request.description);
  });

  it('processes requests successfully', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });
    await crowdFunding.methods
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await crowdFunding.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    await crowdFunding.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let accountTwoBalance = await web3.eth.getBalance(accounts[1]);
    accountTwoBalance = web3.utils.fromWei(accountTwoBalance, 'ether');
    accountTwoBalance = parseFloat(accountTwoBalance);
    assert(accountTwoBalance > 104);
  });

  it('finalizes requests without approving', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await crowdFunding.methods
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    try {
      await crowdFunding.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: '1000000',
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('should fail when a non-manager tries to finalize requests', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });
    await crowdFunding.methods
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await crowdFunding.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    try {
      await crowdFunding.methods.finalizeRequest(0).send({
        from: accounts[5],
        gas: '1000000',
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });
});
