import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // 1. we are in the browser 2. metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/618becb3ba9b4900986e8351a39a6291'
  );
  web3 = new Web3(provider);
}

export default web3;
