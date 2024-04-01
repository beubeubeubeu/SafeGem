const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue, anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { marketplaceFixture } = require('./Fixtures');

describe("Marketplace.sol tests", function () {

  describe('Function: setTicketOnSale', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { marketplace, sgnr1, ticketId } = await loadFixture(marketplaceFixture);
        await expect(marketplace.connect(sgnr1).setTicketOnSale(ticketId, true)).to.be.revertedWithCustomError(marketplace, "MP_MustBeCollectionOwner");
      });
    });

    describe('Effects', function () {
      it('Should set ticket on sale if true is passed', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketInfo = await marketplace.ticketSelling(ticketId);
        expect(ticketInfo.onSale).to.be.true;
      });

      it('Should set ticket off sale if false is passed', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        await marketplace.setTicketOnSale(ticketId, true);
        await marketplace.setTicketOnSale(ticketId, false);
        const ticketInfo = await marketplace.ticketSelling(ticketId);
        expect(ticketInfo.onSale).to.be.false;
      });
    });

    describe('Interactions', function () {
      it('Should emit an event', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        await expect(marketplace.setTicketOnSale(ticketId, true))
          .to.emit(marketplace, 'TicketOnSaleChanged')
          .withArgs(ticketId, true);
      })
    });
  });

  describe('Function: setTicketPrice', function () {
    describe('Checks', function () {
      it('Should revert if called by non collection owner', async function () {
        const { marketplace, ticketId, sgnr1 } = await loadFixture(marketplaceFixture);
        await expect(marketplace.connect(sgnr1).setTicketPrice(ticketId, ethers.parseEther("1")))
          .to.be.revertedWithCustomError(marketplace, "MP_MustBeCollectionOwner");
      });

      it('Should revert if called ticket is not on sale', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        // Ensure the ticket is not on sale before testing
        await marketplace.setTicketOnSale(ticketId, false);
        await expect(marketplace.setTicketPrice(ticketId, ethers.parseEther("1")))
          .to.be.revertedWithCustomError(marketplace, "TicketNotForSale");
      });
    });

    describe('Effects', function () {
      it('Should set ticket price', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
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
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        const newPrice = ethers.parseEther("0.5"); // Define a new price for the ticket
        // Ensure the ticket is on sale to allow price setting
        await marketplace.setTicketOnSale(ticketId, true);
        await expect(marketplace.setTicketPrice(ticketId, newPrice))
          .to.emit(marketplace, 'TicketPriceChanged')
          .withArgs(ticketId, newPrice);
      })
    });
  });


  describe('Function: buyTicket', function () {
    describe('Checks', function () {
      it('Should revert if called ticket is not on sale', async function () {
        const { marketplace, ticketId } = await loadFixture(marketplaceFixture);
        // Ensure the ticket is not on sale before testing
        await marketplace.setTicketOnSale(ticketId, false);
        await expect(marketplace.buyTicket(ticketId,  { value: ethers.parseEther("1.0") }))
          .to.be.revertedWithCustomError(marketplace, "TicketNotForSale");
      });

      it('Should revert if msg.value is lower than ticket price', async function () {
        const { marketplace, sgnr1, ticketId } = await loadFixture(marketplaceFixture);
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
        const { marketplace, owner, sgnr1, ticketId } = await loadFixture(marketplaceFixture);

        // Set the ticket on sale and define a price
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketPrice = ethers.parseEther("2.0");
        await marketplace.setTicketPrice(ticketId, ticketPrice);

        let balanceOfSellerBefore = await marketplace.getBalanceOfUser(owner);

        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice })).to.changeEtherBalance(marketplace, ticketPrice);
        expect(await marketplace.getBalanceOfUser(owner)).to.equal(balanceOfSellerBefore + ticketPrice);
      });

      it('Should approve new owner', async function () {
        const { marketplace, safeTickets, sgnr1, ticketId } = await loadFixture(marketplaceFixture);

        // Buy a ticket
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketPrice = ethers.parseEther("2.0");
        await marketplace.setTicketPrice(ticketId, ticketPrice);

        const ticketInfo = await marketplace.ticketSelling(ticketId);
        const isTicketForSale = await marketplace.isTicketForSale(ticketId);

        await marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice })

        const approvedAfter = await safeTickets.getApproved(ticketId)

        expect(approvedAfter).to.equal(sgnr1.address);
      });
    });

    describe('Interactions', function () {
      it('Should emit a TicketBought event', async function () {

        const { marketplace, sgnr1, ticketId } = await loadFixture(marketplaceFixture);

        // Buy a ticket
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketPrice = ethers.parseEther("2.0");
        await marketplace.setTicketPrice(ticketId, ticketPrice);

        // event TicketBought(_ticketId, msg.sender, msg.value);
        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice }))
          .to.emit(marketplace, 'TicketBought').withArgs(ticketId, sgnr1.address, ticketPrice);
      })

      it('Should emit an OpenZeppelin ERC721 Approval event', async function () {

        const { marketplace, safeTickets, userCollectionAddress, sgnr1, ticketId } = await loadFixture(marketplaceFixture);

        // Buy a ticket
        await marketplace.setTicketOnSale(ticketId, true);
        const ticketPrice = ethers.parseEther("2.0");
        await marketplace.setTicketPrice(ticketId, ticketPrice);

        // event Approval(owner, approved, tokenId);
        await expect(marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice }))
          .to.emit(safeTickets, 'Approval').withArgs(userCollectionAddress, sgnr1.address, ticketId);
      })
    });
  });


  describe('Function: transferTicket', function () {
    describe('Effects', function () {
      it('Should transfer ticket', async function () {
        // TODO
      });
    });

    describe('Interactions', function () {
      it('Should emit a TicketTransferred event', async function () {
        // TODO
        // event FundsWithdrawed(msg.sender, _amount);
      })
    });
  });

  describe('Function: withdraw', function () {
    describe('Checks', function () {
      it('Should revert if user has not enough funds', async function () {
        // TODO
      });
    });

    describe('Effects', function () {
      it('Should lower user balance', async function () {
        // TODO
      });
    });

    describe('Interactions', function () {
      it('Should emit an event', async function () {
        // TODO
        // event FundsWithdrawed(msg.sender, _amount);
      })
    });
  });

  describe('Function: getBalanceOfUser', function () {
    describe('Effects', function () {
      it('Should return user balance', async function () {
        // TODO
      });
    });
  })

})