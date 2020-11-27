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
    JSON.parse(compiledCrowdFundingFactory.interface) //Contract 함수는 파라미터로 자바스크립트 객체를 예상하기 때문에 안에서 JSON.parse를 한다.
  )
    .deploy({
      data: compiledCrowdFundingFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });

  await factory.methods
    .createCrowdFunding('10000') // amount of minimum contribution, 1wei
    .send({ from: accounts[0], gas: '1000000' });

  [
    crowdFundingAddress,
  ] = await factory.methods.getDeployedCrowdFundings().call();

  crowdFunding = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFunding.interface), //abi for our CrowdFunding
    crowdFundingAddress // where this campaign exists
  );
});

describe('CrowdFunding', () => {
  it('deploys a crowdFundingfactory and a crowdFunding', () => {
    assert.ok(factory.options.address);
  });
  it('deploys a crowdFunding', () => {
    assert.ok(crowdFunding.options.address);
  });

  it('marks caller as the crowdfunding campaign manager', async () => {
    // caller: the person who calls a campaign
    const manager = await crowdFunding.methods.manager().call(); // when we make public variables inside a contract, manager method is automatically created
    // call() means we are not modifying data, we are just calling
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as contributors', async () => {
    await crowdFunding.methods.contribute().send({
      value: '10001',
      from: accounts[1],
    });
    const isContributor = await crowdFunding.methods
      .contributors(accounts[1])
      .call(); // methods.contributos(accounts[1])이 어떠한 데이터 변화를 주는 행위를 하지 않기 때문에 call() 붙임

    assert(isContributor);
  });

  // Minimum - lottery와 비슷
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

  it('allows a manager to make a payment request', async () => {
    await crowdFunding.methods
      .createRequest('Buy clothes', '1000', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    const request = await crowdFunding.methods.requests(0).call();
    assert.equal('Buy clothes', request.description);
  });

  it('processes requests', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await crowdFunding.methods
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
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

    let accountOneBalance = await web3.eth.getBalance(accounts[1]);
    accountOneBalance = web3.utils.fromWei(accountOneBalance, 'ether');
    accountOneBalance = parseFloat(accountOneBalance); //take string to decimal number
    console.log('accountOneBalance', accountOneBalance);
    assert(accountOneBalance > 104);
  });

  it('finalize requests without approving', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await crowdFunding.methods
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
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

  it('finalize requests by a non-manager', async () => {
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await crowdFunding.methods
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
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
