// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { SafeTickets } from "./SafeTickets.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

contract Marketplace {

  error WithdrawFailed();
  error TicketNotForSale();
  error NotEnoughFundsProvided();
  error NotEnoughFundsOnBalance();
  error MP_MustBeCollectionOwner();
  error MP_InvalidImplementationAddress();

  struct sellingInfo {
    bool onSale;
    uint price;
  }

  address immutable safeTickets;

  mapping (uint ticketId => sellingInfo) public ticketSelling;
  mapping (address => uint) balances;

  constructor(address _safeTickets) {
    if (_safeTickets == address(0)) {
      revert MP_InvalidImplementationAddress();
    }
    safeTickets = _safeTickets;
  }

  modifier onlyTicketForSale(uint _ticketId) {
    if(!ticketSelling[_ticketId].onSale) {
      revert TicketNotForSale();
    }
    _;
  }

  modifier onlyCollectionOwner(uint _ticketId) {
    if(!isCollectionOwner(_ticketId)) {
      revert MP_MustBeCollectionOwner();
    }
    _;
  }

  /**
   * @dev Sets a ticket on sale.
   *
   */
  function setTicketOnSale(uint _ticketId)
    external
    onlyCollectionOwner(_ticketId)
  {
    ticketSelling[_ticketId].onSale = true;
  }

  /**
   * @dev Sets a ticket off sale.
   *
   */
  function setTicketOffSale(uint _ticketId)
    external
    onlyCollectionOwner(_ticketId)
  {
    ticketSelling[_ticketId].onSale = false;
  }

  /**
   * @dev Sets a ticket price.
   *
   */
  function setTicketPrice(uint _ticketId, uint _priceInWei)
    external
    onlyTicketForSale(_ticketId)
    onlyCollectionOwner(_ticketId)
  {
    ticketSelling[_ticketId].price = _priceInWei;
  }

  /**
   * @dev Buys a ticket.
   * Sets approval for msg sender to transfer
   * ticket calling OpenZeppelin ERC721 approve
   * method.
   *
   */
  function buyTicket(uint _ticketId)
    external
    payable
    onlyTicketForSale(_ticketId)
  {
    if(msg.value < ticketSelling[_ticketId].price) {
      revert NotEnoughFundsProvided();
    }
    SafeTickets safeTicketsInstance = SafeTickets(safeTickets);
    safeTicketsInstance.approve(msg.sender, _ticketId);
    balances[msg.sender] += msg.value;
  }

  /**
   * @dev Transfers a ticket.
   * Ticket must be approved for
   * new owner first.
   *
   */
  function transferTicket(uint _ticketId)
    external
  {
    SafeTickets safeTicketsInstance = SafeTickets(safeTickets);
    safeTicketsInstance.safeTransferFrom(
      safeTicketsInstance.ownerOf(_ticketId),
      msg.sender,
      _ticketId
    );
  }

  /**
   * @dev Withdraws ETH from marketplace.
   */
  function withdraw(uint _amount) external {
    if(_amount > balances[msg.sender]) {
        revert NotEnoughFundsOnBalance();
    }
    balances[msg.sender] -= _amount;
    (bool received,) = msg.sender.call{ value: _amount }('');
    if(!received) {
        revert WithdrawFailed();
    }
  }

  /**
   * @dev Gives balance of an user in wei.
   */
  function getBalanceOfUser(address _user) external view returns(uint) {
    return balances[_user];
  }

  function isCollectionOwner(uint ticketId) private view returns (bool) {
    SafeTickets safeTicketsInstance = SafeTickets(safeTickets);
    address ticketCollection = safeTicketsInstance.ownerOf(ticketId);
    return IAccessControl(ticketCollection).hasRole(keccak256("OWNER"), msg.sender);
  }
}