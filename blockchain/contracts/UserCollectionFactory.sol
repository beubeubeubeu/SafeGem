// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { UserCollection } from "./UserCollection.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract UserCollectionFactory {

  error UCF_InvalidImplementationAddress();

  address immutable userCollection;

  event UserCollectionCreated(
    address _userAddress,
    address _newCollectionAddress,
    uint _timestamp
  );

  constructor(address _userCollection) {
    if (_userCollection == address(0)) {
      revert UCF_InvalidImplementationAddress();
    }
    userCollection = _userCollection;
  }

  /**
  * @dev Creates a new clone of the UserCollection contract.
  */
  function createNFTCollection(string memory _collectionName) external {
    address newCollectionAddress = Clones.clone(userCollection);
    UserCollection(newCollectionAddress).initialize(_collectionName, msg.sender);
    emit UserCollectionCreated(msg.sender, newCollectionAddress, block.timestamp);
  }
}