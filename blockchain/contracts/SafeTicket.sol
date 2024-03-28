// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SafeTicket is ERC721URIStorage {
    uint256 private _nextTicketId;

    constructor() ERC721("SafeTicket", "SFT") {}

    function mintTicket(address collection, string memory TicketURI)
        public
        returns (uint256)
    {
        uint256 TicketId = _nextTicketId++;
        _mint(collection, TicketId);
        _setTokenURI(TicketId, TicketURI);
        return TicketId;
    }
}