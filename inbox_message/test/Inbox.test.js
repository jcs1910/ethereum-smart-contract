const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile'); //destructuring objects

// console.log(web3);
let accounts; // accounts라고 정의는 되었지만 값이 할당이 안됨. 그래서 자동적으로 undefined
let inbox;
const INITIAL_STRING = 'Hello world';

beforeEach(async () => {
  // promise, then || async await => 비동기적인 행동을 동기적으로 사용하는 것처럼 확인할 수 있다.
  // promise에 대한 값을 가져온 것은 then을 통해서다

  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // console.log('accounts', accounts);

  // use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // web3에게 Inbox Contract가 어떤 methods를 가지고 있는지 알려주는 코드
    .deploy({
      // web3에게 새로운 컨트랙트를 배포 하고자 한다는 사실을 알려주는 코드
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: '1000000' }); //web3에게 transaction을 전송하는데 누가 이 컨트랙트를 만들었는지를 알려주는 코드
});

describe('Class Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call(); // Promise<pending>
    assert.equal(message, INITIAL_STRING);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye world').send({
      from: accounts[0],
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye world');
  });
});
