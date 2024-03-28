const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");
const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');


/* ************************************************************************ Fixture ************************************************************************ */

async function deployedContractFixture() {
  const [owner, sgnr1, sgnr2, sgnr3] = await ethers.getSigners();

  const UserCollection = await ethers.getContractFactory('UserCollection');
  const userCollection = await UserCollection.deploy();
  return { userCollection, owner, sgnr1, sgnr2, sgnr3 };
};

describe("User Collection tests", function () {

  // describe('Say hello', function () {
  //   it('Should say hello when say hello is called', async function () {
  //     const { userCollection } = await loadFixture(deployedContractFixture);
  //     expect(await userCollection.sayHello()).to.be.equal("HELLO !");
  //   });
  // })

})