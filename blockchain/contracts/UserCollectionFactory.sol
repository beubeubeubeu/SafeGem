// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./UserCollection.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// TODO : Add description, used to deploy minimal
// proxy contracts, also known as "clones" ERC-1167
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
  function createNFTCollection() external {
    address newCollectionAddress = Clones.clone(userCollection);
    emit UserCollectionCreated(msg.sender, newCollectionAddress, block.timestamp);
  }

}