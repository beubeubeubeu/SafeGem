// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { UserCollection } from "./UserCollection.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SafeTickets is ERC721URIStorage {

  error ImageAlreadyMinted();
  error MetadataAlreadyMinted();
  error ST_MustBeCollectionOwner();

  uint private _nextTicketId;

  mapping (string => bool) private jsonCids;
  mapping (string => bool) private imageCids;

  constructor() ERC721("SafeTicket", "SFT") {}

  // TODO : perhaps set base URI once work with Pinata has begun

  modifier onlyCollectionOwner(address _collection) {
    if(!isCollectionOwner(_collection)) {
      revert ST_MustBeCollectionOwner();
    }
    _;
  }

  event TicketMinted(
    uint indexed _tokenId,
    address _collection,
    string _imageCid,
    string _jsonCid,
    uint _timestamp
  );

  /**
   * @dev Mint a new ticket.
   *
   * Chose mint over safeMint based on:
   * https://ethereum.stackexchange.com/questions/115280/mint-vs-safemint-which-is-best-for-erc721.
   *
   * The way of checking if the token has already been minted should be debated.
   *
   */
  function mintTicket(
    address _collection,
    string memory _imageCid,
    string memory _jsonCid
  )
    external
    onlyCollectionOwner(_collection) returns (uint256)
  {
    if(imageCids[_imageCid]) {
      revert ImageAlreadyMinted();
    }
    if(jsonCids[_jsonCid]) {
      revert MetadataAlreadyMinted();
    }
    uint256 ticketId = _nextTicketId++;
    _mint(_collection, ticketId);
    _setTokenURI(ticketId, concatenateStrings('ipfs://', _jsonCid));
    imageCids[_imageCid] = true;
    jsonCids[_jsonCid] = true;
    emit TicketMinted(ticketId, _collection, _imageCid, _jsonCid, block.timestamp);
    return ticketId;
  }

  function isCollectionOwner(address collection)
    private view returns (bool)
  {
    return UserCollection(payable(collection)).owner() == msg.sender;
  }

  function concatenateStrings(string memory a, string memory b)
    public pure returns (string memory)
  {
    return string(abi.encodePacked(a, b));
  }
}