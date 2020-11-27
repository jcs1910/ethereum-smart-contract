const HDWalletProvider = require('truffle-hdwallet-provider'); //install
const Web3 = require('web3');
const compiledCrowdFundingFactory = require('./build/CrowdFundingFactory.json');
// const { interface, bytecode } = require('./compile.js'); // 수정

// we are only deploying crowdFundingFactory, not crowdFunding

const provider = new HDWalletProvider(
  'edit tray flash horse keep alone magic almost design ozone suffer soul',
  'https://rinkeby.infura.io/v3/618becb3ba9b4900986e8351a39a6291'
);

const web3 = new Web3(provider);

const deploy = async () => {
  let accounts = await web3.eth.getAccounts();
  console.log(
    'Attempting to deploy from account',
    '0x99522AE555f6AbBa3d7DD59708540779A8762ea2'
  );

  const result = await new web3.eth.Contract(
    JSON.parse(compiledCrowdFundingFactory.interface)
  ) // 수정
    .deploy({ data: compiledCrowdFundingFactory.bytecode }) // 수정
    .send({
      from: '0x99522AE555f6AbBa3d7DD59708540779A8762ea2',
      gas: '1000000',
    });

  console.log('Contract Deployed to ', result.options.address);
  result.setProvider(provider);
  return;
};
deploy();
