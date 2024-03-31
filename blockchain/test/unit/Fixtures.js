const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

async function deployedContractFixture() {
  const [owner, sgnr1, sgnr2, sgnr3] = await ethers.getSigners();

  const UserCollection = await ethers.getContractFactory('UserCollection');
  const userCollection = await UserCollection.deploy();

  const UserCollectionFactory = await ethers.getContractFactory('UserCollectionFactory');
  const userCollectionFactory = await UserCollectionFactory.deploy(userCollection);

  return { userCollection, userCollectionFactory, owner, sgnr1, sgnr2, sgnr3 };
};

async function clonedOneUserCollectionFixture() {
  const { userCollectionFactory } = await loadFixture(deployedContractFixture);
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
  const { userCollection, owner, sgnr1 } = await loadFixture(deployedContractFixture);
  await userCollection.initialize("First initialization", owner.address);
  return { userCollection, owner, sgnr1 };
}

async function safeTicketFixture() {
  const { userCollection, owner, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
  const SafeTicket = await ethers.getContractFactory('SafeTickets');
  const safeTicket = await SafeTicket.deploy();
  const userCollectionAddress = await userCollection.getAddress();
  const ticketURI = "https://example.com/ticket";
  return { safeTicket, userCollectionAddress, ticketURI, owner, sgnr1 };
}

async function mintedTicketFixture() {
  const { safeTicket, userCollectionAddress, ticketURI } = await loadFixture(safeTicketFixture);
  // Wrap Transfer event listening in a promise
  const mintedTicketPromise = new Promise((resolve) => {
    safeTicket.on("Transfer", (from, to, ticketId, event) => {
      console.log("Minted ticket from", from);
      console.log("Minted ticket to", to);
      console.log("Minted ticket id ", ticketId);
      event.removeListener();
      resolve(ticketId); // Resolve the promise with the token Id
    });
  })

  const tx = await safeTicket.mintTicket(userCollectionAddress, ticketURI);
  await tx.wait();

  // Wait for the promise to resolve with the token Id
  const ticketId = await mintedTicketPromise;
  return { safeTicket, userCollectionAddress, ticketURI, ticketId };
};

module.exports = {
  deployedContractFixture,
  clonedOneUserCollectionFixture,
  initializedUserCollectionFixture,
  safeTicketFixture,
  mintedTicketFixture
};
