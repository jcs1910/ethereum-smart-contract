// const inbox = require('./contracts/Inbox.sol'); // bad!

const path = require('path');
const fs = require('fs'); //file system
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');

const source = fs.readFileSync(inboxPath, 'utf8'); //한글, 영문을 읽을 수 있는 언어 포멧 // !!! bytecode는 기계만 읽을 수 있음

module.exports = solc.compile(source, 1).contracts[':Inbox'];
