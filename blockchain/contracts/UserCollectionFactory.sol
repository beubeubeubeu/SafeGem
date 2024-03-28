// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./UserCollection.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract UserCollectionFactory {

  error InvalidImplementationAddress();

  address immutable userCollection;

  // TODO : indexed if needed to filter
  event UserCollectionCreated(
    address _userAddress,
    address _newCollectionAddress,
    uint _timestamp
  );

  constructor(address _userCollection) {
    if (_userCollection == address(0)) {
        revert InvalidImplementationAddress();
    }
    userCollection = _userCollection;
  }

  /**
  * @dev Creates a new clone of the UserCollection contract.
  */
  function createNFTCollection(string memory _collectionName) external {
    address newCollectionAddress = Clones.clone(userCollection);
    UserCollection(newCollectionAddress).initialize(_collectionName);
    emit UserCollectionCreated(msg.sender, newCollectionAddress, block.timestamp);
  }

}