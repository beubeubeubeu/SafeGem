const { expect } = require('chai');
const { ethers } = require('hardhat');
const { anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { mintedTicketFixture, ticketToBuyFixture, ticketBoughtFixture } = require('./Fixtures');

describe("Marketplace.sol tests", function () {


  describe('Contract deployment', function() {
    it('Should revert if zero address is given', async function () {
      const Marketplace = await ethers.getContractFactory('Marketplace');
      await expect(Marketplace.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(Marketplace, 'MP_InvalidImplementationAddress');
    });
  });

  describe('Function: setTicketOnSale', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { marketplace, sgnr1, ticketId } = await loadFixture(mintedTicketFixture);
        await expect(marketplace.connect(sgnr1).setTicketOnSale(ticketId, true)).to.be.revertedWithCustomError(marketplace, "MP_MustBeCollectionOwner");
      });
    });

    describe('Effects', function () {
      it('Should set ticket on sale if true is passed', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketInfo = await marketplace.ticketSelling(ticketId);
        expect(ticketInfo.onSale).to.be.true;
      });

      it('Should set ticket off sale if false is passed', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        await marketplace.setTicketOnSale(ticketId, true);
        await marketplace.setTicketOnSale(ticketId, false);
        const ticketInfo = await marketplace.ticketSelling(ticketId);
        expect(ticketInfo.onSale).to.be.false;
      });
    });

    describe('Interactions', function () {
      it('Should emit an event', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        await expect(marketplace.setTicketOnSale(ticketId, true))
          .to.emit(marketplace, 'TicketOnSaleChanged')
          .withArgs(ticketId, true, anyUint);
      })
    });
  });

  describe('Function: setTicketPrice', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { marketplace, ticketId, sgnr1 } = await loadFixture(mintedTicketFixture);
        await expect(marketplace.connect(sgnr1).setTicketPrice(ticketId, ethers.parseEther("1.0")))
          .to.be.revertedWithCustomError(marketplace, "MP_MustBeCollectionOwner");
      });
    });

    describe('Effects', function () {
      it('Should set ticket price', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        const newPrice = ethers.parseEther("0.5"); // Define a new price for the ticket

        // Set the ticket on sale first if needed
        await marketplace.setTicketOnSale(ticketId, true);

        // Now set the ticket price
        await marketplace.setTicketPrice(ticketId, newPrice);

        // Fetch the updated ticket selling info
        const ticketInfo = await marketplace.ticketSelling(ticketId);

        // Check if the ticket price was correctly updated
        expect(ticketInfo.price).to.equal(newPrice);
      });
    });

    describe('Interactions', function () {
      it('Should emit an event', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        const newPrice = ethers.parseEther("0.5"); // Define a new price for the ticket
        // Ensure the ticket is on sale to allow price setting
        await marketplace.setTicketOnSale(ticketId, true);
        await expect(marketplace.setTicketPrice(ticketId, newPrice))
          .to.emit(marketplace, 'TicketPriceChanged')
          .withArgs(ticketId, newPrice, anyUint);
      })
    });
  });

  describe('Function: buyTicket', function () {
    describe('Checks', function () {
      it('Should revert if called ticket is not on sale', async function () {
        const { marketplace, ticketId } = await loadFixture(mintedTicketFixture);
        // Ensure the ticket is not on sale before testing
        await marketplace.setTicketOnSale(ticketId, false);
        await expect(marketplace.buyTicket(ticketId,  { value: ethers.parseEther("1.0") }))
          .to.be.revertedWithCustomError(marketplace, "TicketNotForSale");
      });

      it('Should revert if msg.value is lower than ticket price', async function () {
        const { marketplace, sgnr1, ticketId } = await loadFixture(mintedTicketFixture);
        // Set the ticket on sale and define a price
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketPrice = ethers.parseEther("2.0"); // Setting price higher than payment
        await marketplace.setTicketPrice(ticketId, ticketPrice);

        // Attempt to buy with insufficient funds
        const insufficientPayment = ethers.parseEther("1.0"); // Lower than the ticket price
        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: insufficientPayment }))
          .to.be.revertedWithCustomError(marketplace, "NotEnoughFundsProvided");
      });
    });

    describe('Effects', function () {
      it('Should increase ticket owner virtual balance and contract balance', async function () {
        const { marketplace, owner, sgnr1, ticketId, ticketPrice } = await loadFixture(ticketToBuyFixture);

        let balanceOfSellerBefore = await marketplace.getBalanceOfUser(owner);

        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice })).to.changeEtherBalance(marketplace, ticketPrice);
        expect(await marketplace.getBalanceOfUser(owner)).to.equal(balanceOfSellerBefore + ticketPrice);
      });

      it('Should set new owner', async function () {
        const { safeTickets, sgnr1, ticketId } = await loadFixture(ticketBoughtFixture);

        const ownerAfter = await safeTickets.ownerOf(ticketId)

        expect(ownerAfter).to.equal(sgnr1.address);
      });
    });

    describe('Interactions', function () {
      it('Should emit a TicketBought event', async function () {

        const { marketplace, sgnr1, ticketId, ticketPrice } = await loadFixture(ticketToBuyFixture);

        // event TicketBought(_ticketId, msg.sender, msg.value);
        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice }))
          .to.emit(marketplace, 'TicketBought').withArgs(ticketId, sgnr1.address, ticketPrice, anyUint);
      })

      it('Should emit an OpenZeppelin ERC721 Approval event', async function () {

        const { marketplace, safeTickets, userCollectionAddress, sgnr1, ticketId, ticketPrice } = await loadFixture(ticketToBuyFixture);

        // event Approval(owner, approved, tokenId);
        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice }))
          .to.emit(safeTickets, 'Approval').withArgs(userCollectionAddress, sgnr1.address, ticketId);
      })
    });
  });

  describe('Function: withdraw', function () {
    describe('Checks', function () {
      it('Should revert if user has not enough funds', async function () {
        const { marketplace, owner } = await loadFixture(ticketBoughtFixture);
        const ownerBalance = await marketplace.getBalanceOfUser(owner);
        const withdrawAmount = ownerBalance + ethers.parseEther("1.0");
        await expect(marketplace.withdraw(withdrawAmount)).to.be.revertedWithCustomError(marketplace, "NotEnoughFundsOnBalance");
      });
    });

    describe('Effects', function () {
      it('Should lower user balance', async function () {
        const { marketplace, owner } = await loadFixture(ticketBoughtFixture);
        const ownerBalance = await marketplace.getBalanceOfUser(owner);
        await marketplace.withdraw(ownerBalance)
        expect(await marketplace.getBalanceOfUser(owner)).to.equal(0);
      });
    });

    describe('Interactions', function () {
      it('Should emit an event', async function () {
        const { marketplace, owner } = await loadFixture(ticketBoughtFixture);
        const ownerBalance = await marketplace.getBalanceOfUser(owner);
        expect(marketplace.withdraw(ownerBalance)).to.emit(marketplace, 'FundsWithdrawed').withArgs(owner.address, ownerBalance, anyUint);
      })
    });
  });

  describe('Function: getBalanceOfUser', function () {
    describe('Effects', function () {
      it('Should return user balance', async function () {
        const { marketplace, owner, ticketPrice } = await loadFixture(ticketBoughtFixture);
        const ownerBalance = await marketplace.getBalanceOfUser(owner);
        expect(ownerBalance).to.equal(ticketPrice);
      });
    });
  })

})