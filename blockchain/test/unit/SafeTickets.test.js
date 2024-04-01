const { expect } = require('chai');
const { ethers } = require('hardhat');
const { safeTicketsFixture, mintedTicketFixture } = require('./Fixtures');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe("SafeTickets.sol tests", function () {

  describe('Function: mintTicket', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { safeTickets, userCollectionAddress, ticketURI, sgnr1 } = await loadFixture(safeTicketsFixture);
        await expect(safeTickets.connect(sgnr1).mintTicket(userCollectionAddress, ticketURI)).to.be.revertedWithCustomError(safeTickets, "ST_MustBeCollectionOwner");
      });
    });

    describe('Effects', function () {
      it('Should set collection contract as owner of new ticket', async function () {
        const { safeTickets, ticketId, userCollectionAddress } = await loadFixture(mintedTicketFixture);
        expect(await safeTickets.ownerOf(ticketId)).to.equal(userCollectionAddress);
      });

      it('Should set new ticket uri', async function () {
        const { safeTickets, ticketId, ticketURI } = await loadFixture(mintedTicketFixture);
        expect(await safeTickets.tokenURI(ticketId)).to.equal(ticketURI);
      });
    });

    describe('Interactions', function () {
      it('Should emit an event upon success', async function () {
        const { safeTickets, userCollectionAddress, ticketURI } = await loadFixture(safeTicketsFixture);
        await expect(safeTickets.mintTicket(userCollectionAddress, ticketURI))
          .to.emit(safeTickets, 'Transfer').withArgs(ethers.ZeroAddress, userCollectionAddress, 0n);
      });
    });
  });
});