// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import { SafeTickets } from "./SafeTickets.sol";
import { UserCollection } from "./UserCollection.sol";

contract Marketplace {

  error WithdrawFailed();
  error TicketNotForSale();
  error TicketAlreadySold();
  error NotEnoughFundsProvided();
  error NotEnoughFundsOnBalance();
  error MP_InvalidImplementationAddress();
  error MP_MustBeCollectionOwner(string _msg);

  struct sellingInfo {
    bool onSale;
    bool selling;
    uint price;
  }

  address immutable safeTickets;

  mapping (uint ticketId => sellingInfo) public ticketSelling;
  mapping (address => uint) balances;

  event TicketPriceChanged(uint indexed _ticketId, uint _price);
  event TicketOnSaleChanged(uint indexed _ticketId, bool _onSale);
  event FundsWithdrawed(address indexed _withdrawer, uint _amount);
  event TicketBought(uint indexed _ticketId, address _buyer, uint _price);
  event TicketTransferred(uint indexed _ticketId, address _seller, address _buyer);

  constructor(address _safeTickets) {
    if (_safeTickets == address(0)) {
      revert MP_InvalidImplementationAddress();
    }
    safeTickets = _safeTickets;
  }

  modifier onlyTicketForSale(uint _ticketId) {
    if(!isTicketForSale(_ticketId)) {
      revert TicketNotForSale();
    }
    _;
  }

  modifier onlyCollectionOwner(uint _ticketId) {
    if(!isCollectionOwner(_ticketId)) {
      revert MP_MustBeCollectionOwner("Ticket must be in "
      "collection and collection must be owned by msg.sender");
    }
    _;
  }

  /**
   * @dev Sets a ticket on sale true/false.
   *
   */
  function setTicketOnSale(uint _ticketId, bool _onSale)
    external
    onlyCollectionOwner(_ticketId)
  {
    if(_onSale == true && ticketSelling[_ticketId].selling) {
      revert TicketAlreadySold();
    }
    ticketSelling[_ticketId].onSale = _onSale;
    emit TicketOnSaleChanged(_ticketId, _onSale);
  }

  /**
   * @dev Sets a ticket price.
   *
   */
  function setTicketPrice(uint _ticketId, uint _priceInWei)
    external
    onlyCollectionOwner(_ticketId)
    onlyTicketForSale(_ticketId)
  {
    ticketSelling[_ticketId].price = _priceInWei;
    emit TicketPriceChanged(_ticketId, _priceInWei);
  }

  /**
   * @dev Buys a ticket.
   * Sets approval for msg sender to transfer
   * ticket calling OpenZeppelin ERC721 approve
   * method. Also augment sellers balance.
   * Also sets "selling" true so that nobody
   * else can get approved in the meantime.
   *
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
    UserCollection userCollectionInstance = UserCollection(
      payable(safeTicketsInstance.ownerOf(_ticketId))
    );
    userCollectionInstance.approveBuyer(msg.sender, _ticketId);
    address formerWalletOwner = userCollectionInstance.owner();
    balances[formerWalletOwner] += msg.value;
    ticketSelling[_ticketId].selling = true;
    ticketSelling[_ticketId].onSale = false;
    emit TicketBought(_ticketId, msg.sender, msg.value);
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
    UserCollection userCollectionInstance = UserCollection(
      payable(safeTicketsInstance.ownerOf(_ticketId))
    );
    address formerOwner = safeTicketsInstance.ownerOf(_ticketId);
    address newOwner = safeTicketsInstance.getApproved(_ticketId);
    userCollectionInstance.transferTicket(formerOwner, newOwner, _ticketId);
    ticketSelling[_ticketId].selling = false;
    emit TicketTransferred(_ticketId, formerOwner, newOwner);
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
    emit FundsWithdrawed(msg.sender, _amount);
  }

  /**
   * @dev Gives balance of an user in wei.
   */
  function getBalanceOfUser(address _user) external view returns(uint) {
    return balances[_user];
  }

  function isCollectionOwner(uint _ticketId) private view returns (bool) {
    SafeTickets safeTicketsInstance = SafeTickets(safeTickets);
    address ticketCollection = safeTicketsInstance.ownerOf(_ticketId);
    return UserCollection(payable(ticketCollection)).owner() == msg.sender;
  }

  function isTicketForSale(uint _ticketId) public view returns (bool) {
    return (ticketSelling[_ticketId].onSale && !ticketSelling[_ticketId].selling);
  }
}