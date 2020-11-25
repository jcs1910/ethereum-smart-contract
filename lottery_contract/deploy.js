const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');

const provider = new HDWalletProvider(
  'aunt reason tortoise easily forget giggle era ice pizza click aspect skin',
  'https://rinkeby.infura.io/v3/618becb3ba9b4900986e8351a39a6291'
);

const web3 = new Web3(provider);

const deploy = async () => {
  let accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({
      from: '0xD09f9F1284f9cB8F48463987a2FE8874a226294e',
      gas: '1000000',
    });

  console.log(interface);
  console.log('Contract Deployed to ', result.options.address);
  result.setProvider(provider);
};
deploy();
