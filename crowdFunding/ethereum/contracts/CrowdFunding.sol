pragma solidity ^0.4.17;

contract CrowdFundingFactory {
    address[] public deployedCrowdFundings;

    function createCrowdFunding(uint256 minimumContribution) public {
        address newCrowdFunding = new CrowdFunding(
            minimumContribution,
            msg.sender
        );
        deployedCrowdFundings.push(newCrowdFunding);
    }

    function getDeployedCrowdFundings() public view returns (address[]) {
        return deployedCrowdFundings;
    }
}

contract CrowdFunding {
    struct Request {
        string description; // Describe why a request has been created
        uint256 value; // Amount of money the manager want to send to a vendor
        address recipient; // Address where the money will be send to
        bool complete; // True if the money has been sent
        uint256 approvalCount; // contains the number of people who approved the request
        mapping(address => bool) approvals; // contains the address that approved the request
    }

    // variables - contract storage
    address public manager;
    mapping(address => bool) public contributors; //승인을 해주는 사람
    uint256 public minimumContribution;
    uint256 public totalContributors;
    Request[] public requests; // List of request from the manager needs to be approved before sending value

    function CrowdFunding(uint256 minimum, address creator) public {
        manager = creator; // msg is a global variable
        minimumContribution = minimum;
    }

    modifier minimumContributionValue() {
        require(msg.value > minimumContribution); // if msg.value is less than minimumContribution, require function throws an error and exits the function
        _;
    }

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable minimumContributionValue {
        // approvers.push(msg.sender); // an address of the person who is sending this transaction
        contributors[msg.sender] = true;
        totalContributors++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public managerOnly {
        Request memory newRequest = Request({ // create a Request saved in memory
            description: description,
            value: value,
            recipient: recipient,
            approvalCount: 0,
            complete: false
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(contributors[msg.sender]); // 1. 실제 돈을 내고 contributor가 되었는지 확인
        require(!request.approvals[msg.sender]); // 2. 어떤 요청에 투표를 했는지를 확인

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public managerOnly {
        Request storage request = requests[index];

        require(request.approvalCount > (totalContributors / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
