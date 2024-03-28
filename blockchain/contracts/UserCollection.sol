// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

pragma solidity ^0.8.25;

contract UserCollection {

  error AlreadyInitialized();

  // bool private isInitialized;
  string public collectionName;

  // function initializer(string memory _collectionName) external {
  //   if (isInitialized) {
  //     revert AlreadyInitialized();
  //   }
  //   collectionName = _collectionName;
  //   isInitialized = true;
  // }

  function setCollectionName(string memory _collectionName) external {
    collectionName = _collectionName;
  }

  function getCollection() public {
    // TODO
  }

  function getCollectionName() public {
    // TODO
  }
}