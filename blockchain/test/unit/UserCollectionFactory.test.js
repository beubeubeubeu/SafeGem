const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue, anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

/* ************************************************************************ Fixtures ************************************************************************ */

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
  });

  const tx = await userCollectionFactory.createNFTCollection("My new collection");
  await tx.wait();

    // Wait for the promise to resolve with the clone address
  const cloneAddress = await cloneAddressPromise;
  const clonedUserCollection = await ethers.getContractAt("UserCollection", cloneAddress);
  return { clonedUserCollection };
}

/* ************************************************************************ Tests ************************************************************************ */

describe("User Collection Factory tests", function () {

  describe('contract deployment', function() {
    it('Should revert if zero address is given', async function () {
      const UserCollectionFactory = await ethers.getContractFactory('UserCollectionFactory');
      await expect(UserCollectionFactory.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(UserCollectionFactory, 'InvalidImplementationAddress');
    });
  });

  describe('createNFTCollection function', function () {

    describe('Cloning contract', function () {
      it('Should clone and initialize UserCollection contract', async function () {
        const { clonedUserCollection } = await loadFixture(clonedOneUserCollectionFixture);
				expect(await clonedUserCollection.collectionName()).to.equal("My new collection")
      })
    })

		describe('Event emitting', function () {
      it('Should emit an event upon success', async function () {
        const { userCollectionFactory } = await loadFixture(deployedContractFixture);
				await expect(userCollectionFactory.createNFTCollection("My new collection")).to.emit(userCollectionFactory, "UserCollectionCreated").withArgs(anyValue, anyValue, anyUint);
			});
    })
  })
})