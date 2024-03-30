const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { deployedContractFixture, initializedUserCollectionFixture } = require('./Fixtures');

describe("UserCollection.sol tests", function () {

  describe('Function: initialize', function () {
    describe('Checks', function () {
      it('Should revert if contract is already initialized', async function () {
        const { userCollection, owner } = await loadFixture(initializedUserCollectionFixture);
        await expect(userCollection.initialize("Second initialization", owner)).to.be.revertedWithCustomError(userCollection, 'AlreadyInitialized');
      });
    });

    describe('Effects', function () {
      it('Should grant role OWNER to address passed in argument', async function () {
        const { userCollection, owner } = await loadFixture(initializedUserCollectionFixture);
        expect(await userCollection.hasRole(ethers.id("OWNER"), owner.address)).to.be.true;
      });

      it('Should set collection name', async function () {
        const { userCollection, owner } = await loadFixture(deployedContractFixture);
        const collectionName = "This is an initialized collection";
        await userCollection.initialize(collectionName, owner.address);
        expect(await userCollection.collectionName()).to.equal(collectionName);
      });

      it('Should set initializationTS to current timestamp', async function () {
        const beforeInit = await ethers.provider.getBlock('latest').then(b => b.timestamp);
        const { userCollection } = await loadFixture(initializedUserCollectionFixture);
        const afterInit = await ethers.provider.getBlock('latest').then(b => b.timestamp);
        const initTS = await userCollection.initializationTS();
        expect(initTS).to.be.within(beforeInit, afterInit);
      });
    });
  });

  describe('Function: setCollectionName', function () {
    describe('Checks', function () {
      it('Should revert if empty collection name given', async function () {
        const { userCollection } = await loadFixture(initializedUserCollectionFixture);
        await expect(userCollection.setCollectionName("")).to.be.revertedWithCustomError(userCollection, "CollectionNameEmpty");
      });

      it('Should revert if called by non owner', async function () {
        const { userCollection, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
        await expect(userCollection.connect(sgnr1).setCollectionName("New Name")).to.be.revertedWithCustomError(userCollection, "AccessControlUnauthorizedAccount").withArgs(sgnr1.address, ethers.id("OWNER"));
      });
    });

    describe('Effects', function () {
      it('Should set collection name to new name', async function () {
        const { userCollection } = await loadFixture(initializedUserCollectionFixture);
        const newName = "Updated Collection Name";
        await userCollection.setCollectionName(newName);
        expect(await userCollection.collectionName()).to.equal(newName);
      });
    });
  });

})