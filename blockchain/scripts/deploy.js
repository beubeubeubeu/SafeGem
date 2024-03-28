const hre = require("hardhat");
const { network } = require("hardhat");
require("@nomicfoundation/hardhat-verify");

async function main() {

  // ******** Deploy user collection implementation to be cloned
  const userCollection = await hre.ethers.deployContract("UserCollection");
  await userCollection.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionAddress = userCollection.target;

  console.log(
    `UserCollection implementation deployed to: ${userCollectionAddress}`
  );

  // **************************************** Verify UserCollection on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying contract on Etherscan...');
    await verify(userCollectionAddress);
  }

  // ******** Deploy user collection factory to clone the implementation (calling function createNFTCollection)
  const userCollectionFactory = await hre.ethers.deployContract("UserCollectionFactory", [userCollectionAddress]);
  await userCollectionFactory.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionFactoryAddress = userCollectionFactory.target;

  console.log(
    `UserCollectionFactory deployed to: ${userCollectionFactoryAddress}`
  );

  // **************************************** Verify UserCollectionFactory on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying contract on Etherscan...');
    await verify(userCollectionFactoryAddress, [userCollectionAddress]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
