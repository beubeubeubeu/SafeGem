const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

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
  const userCollectionFactory = await UserCollectionFactory.deploy(
    userCollectionAddress,
    safeTicketsAddress,
    marketplaceAddress
  );

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
    userCollectionFactory.on("UserCollectionCreated", (
      _userAddress,
      _newCollectionAddress,
      _collectionName,
      _timestamp,
    event) => {
      console.log("New clone user address is", _userAddress);
      console.log("New clone collection address is", _newCollectionAddress);
      console.log("New clone collection name is", _collectionName);
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
  const {
    sgnr1,
    owner,
    marketplace,
    safeTickets,
    userCollection,
    safeTicketsAddress,
    marketplaceAddress,
    userCollectionAddress
  } = await loadFixture(deployedBaseContractsFixture);
  await userCollection.initialize(
    "First initialization",
    owner.address,
    safeTicketsAddress,
    marketplaceAddress
  );
  return {
    owner,
    sgnr1,
    safeTickets,
    marketplace,
    userCollection,
    safeTicketsAddress,
    marketplaceAddress,
    userCollectionAddress
  };
}

async function safeTicketsFixture() {
  const {
    owner,
    sgnr1,
    safeTickets,
    marketplace,
    userCollectionAddress,
  } = await loadFixture(initializedUserCollectionFixture);
  jsonCid = "123456789";
  imageCid = "abcdefghi";
  return {
    owner,
    sgnr1,
    jsonCid,
    imageCid,
    safeTickets,
    marketplace,
    userCollectionAddress
  };
};
async function mintedTicketFixture() {
  const {
    owner,
    sgnr1,
    jsonCid,
    imageCid,
    safeTickets,
    marketplace,
    userCollectionAddress
  } = await loadFixture(safeTicketsFixture);
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

  const tx = await safeTickets.mintTicket(userCollectionAddress, imageCid, jsonCid);
  await tx.wait();

  // Wait for the promise to resolve with the token Id
  const ticketId = await mintedTicketPromise;
  return {
    owner,
    sgnr1,
    jsonCid,
    ticketId,
    imageCid,
    safeTickets,
    marketplace,
    userCollectionAddress
  };
};

async function ticketToBuyFixture() {
  const {
    owner,
    sgnr1,
    jsonCid,
    ticketId,
    safeTickets,
    marketplace,
    userCollectionAddress
  } = await loadFixture(mintedTicketFixture);
  // Set the ticket on sale and define a price
  await marketplace.setTicketOnSale(ticketId, true);
  const ticketPrice = ethers.parseEther("2.0");
  await marketplace.setTicketPrice(ticketId, ticketPrice);
  return {
    owner,
    sgnr1,
    jsonCid,
    ticketId,
    ticketPrice,
    safeTickets,
    marketplace,
    userCollectionAddress
  };
}

async function ticketBoughtFixture() {
  const {
    owner,
    sgnr1,
    jsonCid,
    ticketId,
    ticketPrice,
    safeTickets,
    marketplace,
    userCollectionAddress
  } = await loadFixture(ticketToBuyFixture);
  await marketplace.connect(sgnr1).buyTicket(ticketId, { value: ticketPrice })
  return {
    owner,
    sgnr1,
    jsonCid,
    ticketId,
    ticketPrice,
    safeTickets,
    marketplace,
    userCollectionAddress
  };
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
