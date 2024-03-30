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

//
// To test SafeTickets
// We need a collection contract with msg.sender as role OWNER address
//   => at first just try to create a new collection and initialize it from "owner" address
// And a SafeTickets contract
//
async function safeTicketsFixture() {
  const { userCollection, owner, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
  const SafeTickets = await ethers.getContractFactory('SafeTickets');
  const safeTickets = await SafeTickets.deploy(userCollection.address);
  return { safeTickets, userCollection, owner, sgnr1 };
}

module.exports = {
  deployedContractFixture,
  clonedOneUserCollectionFixture,
  initializedUserCollectionFixture
};
