# CrowdFunding Campaign Contract

<em>1.Variables</em>

- manager => address : Address of the person who is managing this campaign
- requests => Request[] : List of requests that the manager has created
- contributors => address[] : List of addresses for every person who has donated money
- minimumContribution => uint: Minimum donation required to be considered a contributor or 'approver'

<em>2.Functions</em>

- Campaign: Constructor function that sets the minimumContribution and the owner
- contribute: Called when someone wants to donate money to the campaign and become an 'contributor'
- createRequest: Called by the manager to create a new 'spending request'
- approveRequest: Called by each contributor to approve a spending request
- finalizeRequest: After a request has gotten enough approvals, the manager can call this to get money send to the vendor

<em>3.Request Struct</em>

- description => string: Purpose of request
- amount => uint: Ether to transfer
- recipient => address: who gets the money
- complete => bool: Whether the request is done
- approvals => mapping: Track who has voted
- approvalCount => uint: Track number of approvals

# CrowdFundingFacotry Contract

<em>1. Variables</em>

- deplotedCrowdFunding => address[]: Addresses of all deployed crowdfunding campaign

<em>2. Functions</em>

- createCrowdFunding: Deploys a new instance of a CrowdFunding and stores the resulting address
- getDeployedCrowdFundings: Returns a list of all deployed crowdfundings
