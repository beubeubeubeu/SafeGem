const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { deployedBaseContractsFixture, initializedUserCollectionFixture } = require('./Fixtures');

describe("UserCollection.sol tests", function () {

  describe('Function: initialize', function () {
    describe('Checks', function () {
      it('Should revert if contract is already initialized', async function () {
        const { userCollection, owner, safeTicketsAddress, marketplaceAddress } = await loadFixture(initializedUserCollectionFixture);
        await expect(userCollection.initialize("Second initialization", owner, safeTicketsAddress, marketplaceAddress)).to.be.revertedWithCustomError(userCollection, 'AlreadyInitialized');
      });
    });

    describe('Effects', function () {
      it('Should set address passed in argument as owner', async function () {
        const { userCollection, owner } = await loadFixture(initializedUserCollectionFixture);
        expect(await userCollection.owner()).to.equal(owner.address);
      });

      it('Should set collection name', async function () {
        const { userCollection, owner, safeTicketsAddress, marketplaceAddress } = await loadFixture(deployedBaseContractsFixture);
        const collectionName = "This is an initialized collection";
        await userCollection.initialize(collectionName, owner.address, safeTicketsAddress, marketplaceAddress);
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
        await expect(userCollection.connect(sgnr1).setCollectionName("New Name")).to.be.revertedWithCustomError(userCollection, "MustBeOwner")
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

  describe('Function: withdraw', function () {
    describe('Checks', function () {
      it('Should revert if called by non owner', async function () {
        const { userCollection, sgnr1 } = await loadFixture(initializedUserCollectionFixture);
        await expect(userCollection.connect(sgnr1).withdraw()).to.be.revertedWithCustomError(userCollection, "MustBeOwner");
      });
    });

    describe('Effects', function () {
      it('Should send funds to owner', async function () {
        const { userCollection, userCollectionAddress, owner } = await loadFixture(initializedUserCollectionFixture);
        const amount = ethers.parseEther("1.0");
        await owner.sendTransaction({ to: userCollectionAddress, value: ethers.parseEther("1") })
        expect(await ethers.provider.getBalance(userCollectionAddress)).to.equal(ethers.parseEther("1"));
        await expect(userCollection.connect(owner).withdraw()).to.changeEtherBalance(owner, amount);
      })
    });
  });

})