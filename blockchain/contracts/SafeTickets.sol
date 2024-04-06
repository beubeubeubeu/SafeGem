// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/Strings.sol";
import { UserCollection } from "./UserCollection.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SafeTickets is ERC721Enumerable, ERC721URIStorage {

  error ImageAlreadyMinted();
  error MetadataAlreadyMinted();
  error ST_MustBeCollectionOwner();

  uint private _nextTicketId;

  mapping (string => bool) private jsonCids;
  mapping (string => bool) private imageCids;
  mapping (uint => string) public tokenImageCids;
  mapping (uint => string) public tokenJsonCids;

  constructor() ERC721("SafeTicket", "SFT") {}

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
    tokenImageCids[ticketId] = _imageCid;
    tokenJsonCids[ticketId] = _jsonCid;
    emit TicketMinted(ticketId, _collection, _imageCid, _jsonCid, block.timestamp);
    return ticketId;
  }

  function isCollectionOwner(address collection)
    private view returns (bool)
  {
    return UserCollection(payable(collection)).owner() == msg.sender;
  }

  /**
   * @dev Concatenates two strings.
   * Slither detected potential issue here.
   * This should be done offchain.
   * https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision
   *
   */
  function concatenateStrings(string memory a, string memory b)
    private pure returns (string memory)
  {
    return string(abi.encodePacked(a, b));
  }

  /**
   * @dev Override Openzeppelin
   *
  */
  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721URIStorage, ERC721)
    returns (string memory)
  {
      return super.tokenURI(tokenId);
  }

  /**
   * @dev Override Openzeppelin
   *
  */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721URIStorage, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Override Openzeppelin
   *
  */
  function _increaseBalance(address account, uint128 amount)
    internal
    virtual
    override(ERC721, ERC721Enumerable)
  {
    super._increaseBalance(account, amount);
  }

  /**
   * @dev Override Openzeppelin
   *
  */
  function _update(address to, uint256 tokenId, address auth)
    internal
    virtual
    override(ERC721, ERC721Enumerable) returns (address)
  {
    return super._update(to, tokenId, auth);
  }
}