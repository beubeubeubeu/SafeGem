// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./UserCollection.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "hardhat/console.sol";

// TODO : Add description, used to deploy minimal
// proxy contracts, also known as "clones" ERC-1167
contract UserCollectionFactory {

  error InvalidImplementationAddress();

  address immutable userCollection;

  // TODO : indexed if needed to filter
  event UserCollectionCreated(string _collectionName, address _newCollectionAddress, uint _timestamp);

  constructor(address _userCollection) {
    if (_userCollection == address(0)) {
        revert InvalidImplementationAddress();
    }
    userCollection = _userCollection;
  }

  /**
  * @dev Creates a new clone of the UserCollection contract.
  * @param _collectionName The name of the collection for the new UserCollection.
  */
  function createNFTCollection(string memory _collectionName) external returns (address newCollectionAddress) {
    newCollectionAddress = Clones.clone(userCollection);
    emit UserCollectionCreated(_collectionName, newCollectionAddress, block.timestamp);
    return newCollectionAddress;
  }

}