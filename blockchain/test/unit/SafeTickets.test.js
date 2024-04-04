const { expect } = require('chai');
const { ethers } = require('hardhat');
const { safeTicketsFixture, mintedTicketFixture } = require('./Fixtures');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe("SafeTickets.sol tests", function () {

  describe('Function: mintTicket', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { safeTickets, userCollectionAddress, imageCid, jsonCid, sgnr1 } = await loadFixture(safeTicketsFixture);
        await expect(safeTickets.connect(sgnr1).mintTicket(userCollectionAddress, imageCid, jsonCid)).to.be.revertedWithCustomError(safeTickets, "ST_MustBeCollectionOwner");
      });

      it('Should revert if imageCid already minted', async function () {
        const { safeTickets, userCollectionAddress, imageCid } = await loadFixture(mintedTicketFixture);
        const newJsonCid = 'azertyuiop';
        await expect(safeTickets.mintTicket(userCollectionAddress, imageCid, newJsonCid)).to.be.revertedWithCustomError(safeTickets, "ImageAlreadyMinted");
      })

      it('Should revert if jsonCid already minted', async function () {
        const { safeTickets, userCollectionAddress, jsonCid } = await loadFixture(mintedTicketFixture);
        const newImageCid = 'azertyuiop';
        await expect(safeTickets.mintTicket(userCollectionAddress, newImageCid, jsonCid)).to.be.revertedWithCustomError(safeTickets, "MetadataAlreadyMinted");
      })
    });

    describe('Effects', function () {
      it('Should set collection contract as owner of new ticket', async function () {
        const { safeTickets, ticketId, userCollectionAddress } = await loadFixture(mintedTicketFixture);
        expect(await safeTickets.ownerOf(ticketId)).to.equal(userCollectionAddress);
      });

      it('Should set new ticket uri', async function () {
        const { safeTickets, ticketId, jsonCid } = await loadFixture(mintedTicketFixture);
        expect(await safeTickets.tokenURI(ticketId)).to.equal(`ipfs://${jsonCid}`);
      });
    });

    describe('Interactions', function () {
      it('Should emit a Transfer event upon success', async function () {
        const { safeTickets, userCollectionAddress, imageCid, jsonCid } = await loadFixture(safeTicketsFixture);
        await expect(safeTickets.mintTicket(userCollectionAddress, imageCid, jsonCid))
          .to.emit(safeTickets, 'Transfer').withArgs(ethers.ZeroAddress, userCollectionAddress, 0n);
      });

      it('Should emit a TicketMinted event upon success', async function () {
        const { safeTickets, userCollectionAddress, imageCid, jsonCid } = await loadFixture(safeTicketsFixture);
        await expect(safeTickets.mintTicket(userCollectionAddress, imageCid, jsonCid))
          .to.emit(safeTickets, 'TicketMinted').withArgs(0n, userCollectionAddress, imageCid, jsonCid);
      });
    });
  });
});