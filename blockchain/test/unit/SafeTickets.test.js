const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue, anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { safeTicketsFixture } = require('./Fixtures');

describe("SafeTicket.sol tests", function () {

  describe('Function: mintTicket', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { safeTickets, userCollection, owner, sgnr1 } = await loadFixture(safeTicketsFixture);
        // TODO
        // as an exemple:
        // ```
        // it('Should revert if called by non owner', async function () {
        //   const { userCollection, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
        //   await expect(userCollection.connect(sgnr1).setCollectionName("New Name")).to.be.revertedWithCustomError(userCollection, "AccessControlUnauthorizedAccount").withArgs(sgnr1.address, ethers.id("OWNER"));
        // });
        // ```
      });
    });

    describe('Effects', function () {
      it('Should increment _nextTicketId', async function () {
        const { safeTickets, userCollection, owner } = await loadFixture(safeTicketsFixture);
        // TODO

      });

      it('Should set collection as owner of new ticket', async function () {
        // TODO
        // loadFixture(safeTicketsFixture) if needed
        // use safeTicket.ownerOf(newTicketId)
      });

      it('Should set new ticket uri', async function () {
        // TODO
        // loadFixture(safeTicketsFixture) if needed
        // add a random URI like `https://example.com/${_nextTicketId}`
        // use safeTicket.tokenURI(newTicketId)
      });
    });

    describe('Interactions', function () {
      it('Should emit an event upon success', async function () {
        // TODO
        // loadFixture(safeTicketsFixture) if needed
        // as an example you can check below:
        // ```
        // it('Should emit an event upon success', async function () {
        //   const { userCollectionFactory } = await loadFixture(deployedContractFixture);
				//   await expect(userCollectionFactory.createNFTCollection("My new collection")).to.emit(userCollectionFactory, "UserCollectionCreated").withArgs(anyValue, anyValue, anyUint);
        // }):
        // ```
        // Event is "Transfer" with args anyValue, anyValue, anyUint
			});
      });
    });
  });
})