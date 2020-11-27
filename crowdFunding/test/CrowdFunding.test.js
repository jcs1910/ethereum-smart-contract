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
<<<<<<< HEAD
    .createCrowdFunding('10000') // amount of minimum contribution, 1wei
    .send({ from: accounts[0], gas: '1000000' });
=======
    .createCrowdFunding('10000') // wei로 전달
    .send({
      from: accounts[0],
      gas: '1000000',
    });
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65

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

<<<<<<< HEAD
  it('marks caller as the crowdfunding campaign manager', async () => {
    // caller: the person who calls a campaign
    const manager = await crowdFunding.methods.manager().call(); // when we make public variables inside a contract, manager method is automatically created
    // call() means we are not modifying data, we are just calling
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as contributors', async () => {
=======
  it('verifies whether the crowdFunding manager is a correct person', async () => {
    const manager = await crowdFunding.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribue money and marks them as contributors', async () => {
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
    await crowdFunding.methods.contribute().send({
      value: '10001',
      from: accounts[1],
    });
    const isContributor = await crowdFunding.methods
      .contributors(accounts[1])
<<<<<<< HEAD
      .call(); // methods.contributos(accounts[1])이 어떠한 데이터 변화를 주는 행위를 하지 않기 때문에 call() 붙임
=======
      .call();
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65

    assert(isContributor);
  });

<<<<<<< HEAD
  // Minimum - lottery와 비슷
=======
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
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

<<<<<<< HEAD
  it('allows a manager to make a payment request', async () => {
    await crowdFunding.methods
      .createRequest('Buy clothes', '1000', accounts[1])
=======
  it('allows a manager to make a paymenet request', async () => {
    await crowdFunding.methods
      .createRequest('Buy a car', '100000', accounts[1])
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    const request = await crowdFunding.methods.requests(0).call();
<<<<<<< HEAD
    assert.equal('Buy clothes', request.description);
  });

  it('processes requests', async () => {
=======
    assert.equal('Buy a car', request.description);
  });

  it('processes requests successfully', async () => {
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });
<<<<<<< HEAD

    await crowdFunding.methods
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
=======
    await crowdFunding.methods
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
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

<<<<<<< HEAD
    let accountOneBalance = await web3.eth.getBalance(accounts[1]);
    accountOneBalance = web3.utils.fromWei(accountOneBalance, 'ether');
    accountOneBalance = parseFloat(accountOneBalance); //take string to decimal number
    console.log('accountOneBalance', accountOneBalance);
    assert(accountOneBalance > 104);
  });

  it('finalize requests without approving', async () => {
=======
    let accountTwoBalance = await web3.eth.getBalance(accounts[1]);
    accountTwoBalance = web3.utils.fromWei(accountTwoBalance, 'ether');
    accountTwoBalance = parseFloat(accountTwoBalance);
    assert(accountTwoBalance > 104);
  });

  it('finalizes requests without approving', async () => {
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await crowdFunding.methods
<<<<<<< HEAD
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
=======
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    try {
      await crowdFunding.methods.finalizeRequest(0).send({
        from: accounts[0],
        gas: '1000000',
      });
<<<<<<< HEAD
=======

>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

<<<<<<< HEAD
  it('finalize requests by a non-manager', async () => {
=======
  it('should fail when a non-manager tries to finalize requests', async () => {
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
    await crowdFunding.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });
<<<<<<< HEAD

    await crowdFunding.methods
      .createRequest(
        'buy Computer',
        web3.utils.toWei('5', 'ether'),
        accounts[1]
      )
=======
    await crowdFunding.methods
      .createRequest('Buy a car', web3.utils.toWei('5', 'ether'), accounts[1])
>>>>>>> db95bfd5ff443302aa9c754dc98af3e48f0e2c65
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
