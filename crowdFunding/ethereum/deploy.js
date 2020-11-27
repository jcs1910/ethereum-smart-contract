const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledCrowdFundingFactory = require('./build/CrowdFundingFactory.json');

const provider = new HDWalletProvider(
  'crack silk middle curious holiday truck relax plunge pyramid duck hurdle false',
  'https://rinkeby.infura.io/v3/618becb3ba9b4900986e8351a39a6291'
);

const web3 = new Web3(provider);
let account = '0xfb16585e56f5258d2aa5e048000da89f1b1fa4f9';

const deploy = async () => {
  accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', account);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFundingFactory.interface)
  )
    .deploy({ data: compiledCrowdFundingFactory.bytecode })
    .send({
      from: account,
      gas: '1000000',
    });

  console.log('Contract Deployed to ', result.options.address);
  result.setProvider(provider);
  return;
};
deploy();
