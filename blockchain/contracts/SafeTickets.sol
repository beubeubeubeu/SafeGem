// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { UserCollection } from "./UserCollection.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SafeTickets is ERC721URIStorage {

  error ST_MustBeCollectionOwner();

  uint private _nextTicketId;

  constructor() ERC721("SafeTicket", "SFT") {}

  // TODO : perhaps set base URI once work with Pinata has begun

  modifier onlyCollectionOwner(address _collection) {
    if(!isCollectionOwner(_collection)) {
      revert ST_MustBeCollectionOwner();
    }
    _;
  }

  /**
   * @dev Mint a new ticket.
   *
   * Chose mint over safeMint based on:
   * https://ethereum.stackexchange.com/questions/115280/mint-vs-safemint-which-is-best-for-erc721.
   *
   */
  function mintTicket(address _collection, string memory _ticketURI)
    external
    onlyCollectionOwner(_collection) returns (uint256)
  {
    uint256 ticketId = _nextTicketId++;
    _mint(_collection, ticketId);
    _setTokenURI(ticketId, _ticketURI);
    return ticketId;
  }

  function isCollectionOwner(address collection)
    private view returns (bool)
  {
    return UserCollection(payable(collection)).owner() == msg.sender;
  }
}