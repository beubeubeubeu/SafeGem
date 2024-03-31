const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue, anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { safeTicketFixture, mintedTicketFixture } = require('./Fixtures');

describe("SafeTicket.sol tests", function () {

  describe('Function: mintTicket', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { safeTicket, userCollectionAddress, ticketURI, sgnr1 } = await loadFixture(safeTicketFixture);
        await expect(safeTicket.connect(sgnr1).mintTicket(userCollectionAddress, ticketURI)).to.be.revertedWithCustomError(safeTicket, "MustBeCollectionOwner");
      });
    });

    describe('Effects', function () {
      it('Should set collection contract as owner of new ticket', async function () {
        const { safeTicket, ticketId, userCollectionAddress } = await loadFixture(mintedTicketFixture);
        expect(await safeTicket.ownerOf(ticketId)).to.equal(userCollectionAddress);
      });

      it('Should set new ticket uri', async function () {
        const { safeTicket, ticketId, ticketURI } = await loadFixture(mintedTicketFixture);
        expect(await safeTicket.tokenURI(ticketId)).to.equal(ticketURI);
      });
    });

    describe('Interactions', function () {
      it('Should emit an event upon success', async function () {
        const { safeTicket, userCollectionAddress } = await loadFixture(safeTicketFixture);
        const ticketURI = "https://example.com/ticket";
        await expect(safeTicket.mintTicket(userCollectionAddress, ticketURI))
          .to.emit(safeTicket, 'Transfer').withArgs(ethers.ZeroAddress, userCollectionAddress, 0n);
      });
    });
  });
});