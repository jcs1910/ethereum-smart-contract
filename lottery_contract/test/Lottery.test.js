const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  let theNumberOfPlayers;
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });
});

describe('Enter Lottery contract', () => {
  theNumberOfPlayers = 1;
  it('approve a player to join the lottery game', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.2', 'ether'),
    });

    // 플레이어 전체를 확인해서 해당 금액을 전송했는지를 확인하는 코드
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(players[0], accounts[0]);
    assert.equal(theNumberOfPlayers, players.length);
  });

  it('approve multiple players to join the lottery game', async () => {
    theNumberOfPlayers = 4;
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.2', 'ether'),
      });
    } catch (error) {
      throw new Error();
    }

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.2', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.2', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('0.2', 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
    assert.equal(players[3], accounts[3]);
    assert.equal(theNumberOfPlayers, players.length);
  });

  it('only a manager can declare a pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('send prize to the winner and resets the game', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    console.log('initialBalance', initialBalance);
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    console.log('difference', difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'));

    const players = await lottery.methods.getPlayers().call();
    assert.equal(0, players.length);
  });

  // it('sends the manager share', async () => {
  //   for (let i = 1; i < 5; i++) {
  //     await lottery.methods.enter().send({
  //       from: accounts[i],
  //       value: web3.utils.toWei('0.01', 'ether'),
  //     });
  //   }
  //   const initialManagerBalance = await web3.eth.getBalance(accounts[0]);
  //   console.log('initialManagerBalance', initialManagerBalance);
  //   await lottery.methods.pickWinner().send({
  //     from: accounts[0],
  //   });

  //   const finalManagerBalance = await web3.eth.getBalance(accounts[0]);
  //   console.log('finalManagerBalance', finalManagerBalance);
  //   assert(finalManagerBalance > initialManagerBalance);
  // });
});
