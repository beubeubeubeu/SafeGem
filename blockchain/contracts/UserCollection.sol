// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserCollection is AccessControl {

  error AlreadyInitialized();
  error CollectionNameEmpty();

  bool private isInitialized;
  uint public initializationTS;
  string public collectionName;
  bytes32 public constant OWNER = keccak256("OWNER");

  function initialize(string memory _collectionName, address _userAddress) external {
    if(isInitialized) {
      revert AlreadyInitialized();
    }
    _grantRole(OWNER, _userAddress);
    collectionName = _collectionName;
    initializationTS = block.timestamp;
    isInitialized = true;
  }

  function setCollectionName(string memory _collectionName) external onlyRole(OWNER) {
    if (bytes(_collectionName).length == 0) {
      revert CollectionNameEmpty();
    }
    collectionName = _collectionName;
  }
}