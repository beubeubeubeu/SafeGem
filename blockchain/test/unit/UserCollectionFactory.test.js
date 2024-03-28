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

/* ************************************************************************ Tests ************************************************************************ */

describe("User Collection Factory tests", function () {

  describe('contract deployment initiation', function() {
    it('Should revert if zero address is given', async function () {
      const UserCollectionFactory = await ethers.getContractFactory('UserCollectionFactory');
      await expect(UserCollectionFactory.deploy(ethers.ZeroAddress)).to.be.revertedWithCustomError(UserCollectionFactory, 'InvalidImplementationAddress');
    });
  });

  describe('createNFTCollection function', function () {
		describe('Event emitting', function () {
      it('Should emit an event upon success', async function () {
        const { userCollectionFactory } = await loadFixture(deployedContractFixture);
				await expect(userCollectionFactory.createNFTCollection()).to.emit(userCollectionFactory, "UserCollectionCreated").withArgs(anyValue, anyValue, anyUint);
			});
    })
  })

})