import web3 from './web3';

import CrowdFundingFactory from './build/CrowdFundingFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CrowdFundingFactory.interface),
  '0xaECCCdA91e4b73f75Ad07Db03E7A6Ed1303a514D'
);

export default instance;
