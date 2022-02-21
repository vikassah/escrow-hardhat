// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Escrow {
    address public depositor;
    address payable public beneficiary;
    address public arbiter;
    bool public isApproved;

    event Approved(uint balance);
    
    constructor(address _arbiter, address payable _beneficiary) payable {
		require(msg.sender != _beneficiary, "beneficiary and owner cannot be same");
		require(msg.sender != _arbiter, "arbiter and owner cannot be same");
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        isApproved = false;
    }

    function approve() external {
		console.log("arbiter:", arbiter);
		console.log("msg.sender:", msg.sender);
        require(msg.sender == arbiter, "not arbiter");
        isApproved = true;
        uint balance = address(this).balance;
        beneficiary.transfer(address(this).balance);
        emit Approved(balance);
    }
}