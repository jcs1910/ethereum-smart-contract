const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config();

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.SERVER);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from accounts', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: '0x' + bytecode,
      arguments: ['Hello World'],
    })
    .send({
      gas: '1000000',
      from: '0xfd5a14498c52E6178a1548d0a23D58EfE2cEB53f',
    });

  console.log('Contract deployed to', result.options.address);
  return;
};

deploy();
