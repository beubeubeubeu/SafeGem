const { expect } = require('chai');
const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue, anyUint } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { deployedBaseContractsFixture, clonedOneUserCollectionFixture } = require('./Fixtures');


describe("UserCollectionFactory.sol tests", function () {

  describe('Contract deployment', function() {
    it('Should revert if zero address is given', async function () {
      const UserCollectionFactory = await ethers.getContractFactory('UserCollectionFactory');
      await expect(UserCollectionFactory.deploy(ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress)).to.be.revertedWithCustomError(UserCollectionFactory, 'UCF_InvalidImplementationAddress');
    });
  });

  describe('Function: createNFTCollection', function () {
    describe('Effects', function () {
      it('Should clone and initialize UserCollection contract', async function () {
        const { clonedUserCollection } = await loadFixture(clonedOneUserCollectionFixture);
				expect(await clonedUserCollection.collectionName()).to.equal("My new collection");
      });
    });

		describe('Interactions', function () {
      it('Should emit an event upon success', async function () {
        const { userCollectionFactory, owner } = await loadFixture(deployedBaseContractsFixture);
				await expect(userCollectionFactory.createNFTCollection("My new collection")).to.emit(userCollectionFactory, "UserCollectionCreated").withArgs(owner.address, anyValue, "My new collection", anyUint);
			});
    });
  });

})