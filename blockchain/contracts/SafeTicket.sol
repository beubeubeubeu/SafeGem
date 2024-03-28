// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SafeTicket is ERC721URIStorage {

    error MustBeCollectionOwner();

    uint256 private _nextTicketId;

    constructor() ERC721("SafeTicket", "SFT") {}

    function mintTicket(address collection, string memory _ticketURI) public returns (uint256) {
        if(!IAccessControl(collection).hasRole(keccak256("OWNER"), msg.sender)) {
            revert MustBeCollectionOwner();
        }
        uint256 TicketId = _nextTicketId++;
        _mint(collection, TicketId);
        _setTokenURI(TicketId, _ticketURI);
        return TicketId;
    }
}