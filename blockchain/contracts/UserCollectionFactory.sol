// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { UserCollection } from "./UserCollection.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract UserCollectionFactory {

  error UCF_InvalidImplementationAddress();

  address immutable userCollection;
  address immutable safeTickets;
  address immutable marketplace;

  event UserCollectionCreated(
    address _userAddress,
    address _newCollectionAddress,
    string _collectionName,
    uint _timestamp
  );

  constructor(address _userCollection, address _safeTickets, address _marketplace) {
    if (_userCollection == address(0) || _safeTickets == address(0) || _marketplace == address(0)) {
      revert UCF_InvalidImplementationAddress();
    }
    userCollection = _userCollection;
    safeTickets = _safeTickets;
    marketplace = _marketplace;
  }

  /**
  * @dev Creates a new clone of the UserCollection contract.
  */
  function createNFTCollection(string memory _collectionName) external {
    address newCollectionAddress = Clones.clone(userCollection);
    UserCollection(payable(newCollectionAddress)).initialize(_collectionName, msg.sender, safeTickets, marketplace);
    emit UserCollectionCreated(msg.sender, newCollectionAddress, _collectionName, block.timestamp);
  }
}