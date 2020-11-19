pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players; // 1. there is static, dynamic array, public: it is ok to see who has entered this game
    address public winner;

    // Only a manager can create this contract
    modifier onlyManagerCanSendPrize() {
        require(msg.sender == manager);
        _;
    }

    modifier validValue() {
        require(msg.value > .01 ether);
        _;
    }

    function Lottery() public {
        // 2. Need to obtain an address of the person who attempts to create a contract
        manager = msg.sender;
    }

    function enter() public payable validValue {
        // 3. allow anyone to join this game
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        // uint === uint256 //pseudo-random (의사난수), public => private
        return uint256(keccak256(block.difficulty, now, players)); // sha3 === keccak256, block.difficulty, currentTime, particpants
    } // pseudo-random is predictable, not truly random

    function pickWinner() public onlyManagerCanSendPrize {
        // pick a winner
        uint256 index = random() % players.length; // Given a random number and the number of players, an index is determined by random and the number of players modular
        // uint256 share = ((this.balance) * 5) / 100;
        winner = players[index];
        winner.transfer(this.balance); // When a winner is selected, the winner gets the money.

        // manager.transfer(share);

        players = new address[](0); // reset a contract to have another new round of a game //
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}
