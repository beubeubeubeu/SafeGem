const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

// In order "base contracts" are:
// - UserCollection (original)
// - SafeTickets
// - Marketplace
// - UserCollectionFactory
async function deployedBaseContractsFixture() {
  const [owner, sgnr1, sgnr2, sgnr3] = await ethers.getSigners();

  const UserCollection = await ethers.getContractFactory('UserCollection');
  const userCollection = await UserCollection.deploy();
  const userCollectionAddress = await userCollection.getAddress();

  const SafeTickets = await ethers.getContractFactory('SafeTickets');
  const safeTickets = await SafeTickets.deploy();
  const safeTicketsAddress = await safeTickets.getAddress();

  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy(safeTicketsAddress);
  const marketplaceAddress = await marketplace.getAddress();

  const UserCollectionFactory = await ethers.getContractFactory('UserCollectionFactory');
  const userCollectionFactory = await UserCollectionFactory.deploy(userCollectionAddress, safeTicketsAddress, marketplaceAddress);

  return {
    userCollection,
    safeTickets,
    marketplace,
    userCollectionFactory,
    userCollectionAddress,
    safeTicketsAddress,
    marketplaceAddress,
    owner, sgnr1, sgnr2, sgnr3
  };
};

async function clonedOneUserCollectionFixture() {
  const { userCollectionFactory } = await loadFixture(deployedBaseContractsFixture);
  // Wrap UserCollectionCreated event listening in a promise
  const cloneAddressPromise = new Promise((resolve) => {
    userCollectionFactory.on("UserCollectionCreated", (_userAddress, _newCollectionAddress, _timestamp, event) => {
      console.log("New clone user address is", _userAddress);
      console.log("New clone collection address is", _newCollectionAddress);
      console.log("New clone collection deployed at block timestamp", _timestamp);
      event.removeListener();
      resolve(_newCollectionAddress); // Resolve the promise with the address
    });
  })

  const tx = await userCollectionFactory.createNFTCollection("My new collection");
  await tx.wait();

  // Wait for the promise to resolve with the clone address
  const cloneAddress = await cloneAddressPromise;
  const clonedUserCollection = await ethers.getContractAt("UserCollection", cloneAddress);
  return { clonedUserCollection };
};

async function initializedUserCollectionFixture() {
  const { safeTickets, marketplace, safeTicketsAddress, marketplaceAddress, userCollectionAddress, userCollection, owner, sgnr1 } = await loadFixture(deployedBaseContractsFixture);
  await userCollection.initialize("First initialization", owner.address, safeTicketsAddress, marketplaceAddress);
  return { safeTickets, marketplace, userCollection, safeTicketsAddress, marketplaceAddress, userCollectionAddress, owner, sgnr1 };
}

async function safeTicketsFixture() {
  const { safeTickets, marketplace, userCollectionAddress, owner, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
  ticketURI = "https://example.com/ticket";
  return { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI };
};
async function mintedTicketFixture() {
  const { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI  } = await loadFixture(safeTicketsFixture);
  // Wrap Transfer event listening in a promise
  const mintedTicketPromise = new Promise((resolve) => {
    safeTickets.on("Transfer", (from, to, ticketId, event) => {
      console.log("Minted ticket from", from);
      console.log("Minted ticket to", to);
      console.log("Minted ticket id ", ticketId);
      event.removeListener();
      resolve(ticketId); // Resolve the promise with the token Id
    });
  })

  const tx = await safeTickets.mintTicket(userCollectionAddress, ticketURI);
  await tx.wait();

  // Wait for the promise to resolve with the token Id
  const ticketId = await mintedTicketPromise;
  return { safeTickets, marketplace, userCollectionAddress, ticketURI, ticketId, owner, sgnr1 };
};

async function ticketToBuyFixture() {
  const { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI, ticketId } = await loadFixture(mintedTicketFixture);
  // Set the ticket on sale and define a price
  await marketplace.setTicketOnSale(ticketId, true);
  const ticketPrice = ethers.parseEther("2.0");
  await marketplace.setTicketPrice(ticketId, ticketPrice);
  return { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI, ticketId, ticketPrice };
}

async function ticketBoughtFixture() {
  const { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI, ticketId, ticketPrice } = await loadFixture(ticketToBuyFixture);
  await marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice })
  return { safeTickets, marketplace, userCollectionAddress, owner, sgnr1, ticketURI, ticketId, ticketPrice };
}

module.exports = {
  deployedBaseContractsFixture,
  safeTicketsFixture,
  clonedOneUserCollectionFixture,
  initializedUserCollectionFixture,
  mintedTicketFixture,
  ticketToBuyFixture,
  ticketBoughtFixture
};
