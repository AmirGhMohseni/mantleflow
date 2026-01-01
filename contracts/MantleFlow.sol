// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MantleFlow {
    address public owner;
    address public flowToken;

    struct Business {
        string name;
        bool verified;
    }

    mapping(address => Business) public businesses;

    event BusinessRegistered(address indexed business, string name);
    event BusinessVerified(address indexed business);

    constructor(address _flowToken) {
        owner = msg.sender;
        flowToken = _flowToken;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function registerBusiness(string calldata name) external {
        businesses[msg.sender] = Business({
            name: name,
            verified: false
        });

        emit BusinessRegistered(msg.sender, name);
    }

    function verifyBusiness(address business) external onlyOwner {
        businesses[business].verified = true;
        emit BusinessVerified(business);
    }

    function isVerified(address business) external view returns (bool) {
        return businesses[business].verified;
    }
}
