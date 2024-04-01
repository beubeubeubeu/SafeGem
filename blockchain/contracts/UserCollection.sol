// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "./SafeTickets.sol";
import "./Marketplace.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract UserCollection {

  error MustBeOwner();
  error AlreadyInitialized();
  error CollectionNameEmpty();
  error MarketplaceCheckFailed();

  bool private isInitialized;
  address private safeTickets;
  address private marketplace;
  address public owner;
  uint public initializationTS;
  string public collectionName;

  modifier onlyOwner() {
    if(msg.sender != owner) {
      revert MustBeOwner();
    }
    _;
  }

  modifier onlyTicketForSale(uint _ticketId) {
    Marketplace marketplaceInstance = Marketplace(marketplace);
    bool isForSale = marketplaceInstance.isTicketForSale(_ticketId);
    if(!marketplaceInstance.isTicketForSale(_ticketId)) {
      revert MarketplaceCheckFailed();
    }
    _;
  }

  function initialize(
    string memory _collectionName,
    address _userAddress,
    address _safeTickets,
    address _marketplace
    ) external
  {
    if(isInitialized) {
      revert AlreadyInitialized();
    }
    owner = _userAddress;
    collectionName = _collectionName;
    initializationTS = block.timestamp;
    safeTickets = _safeTickets;
    marketplace = _marketplace;
    isInitialized = true;
  }

  function setCollectionName(string memory _collectionName) external onlyOwner {
    if (bytes(_collectionName).length == 0) {
      revert CollectionNameEmpty();
    }
    collectionName = _collectionName;
  }

  function approveBuyer(address _to, uint _ticketId) external onlyTicketForSale(_ticketId) {
    SafeTickets(safeTickets).approve(_to, _ticketId);
  }

  function transferTicket(address _from, address _to, uint _ticketId) external {
    SafeTickets(safeTickets).safeTransferFrom(_from, _to, _ticketId);
  }

  /**
   * @dev The owner should be able to withdraw Eth.
   */
  function withdraw() external onlyOwner {
    require(msg.sender == owner, "Not the owner");
    payable(msg.sender).transfer(address(this).balance);
  }

  /**
   * @dev The contract should be able to receive Eth.
   */
  receive() external payable virtual {}
}