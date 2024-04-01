const hre = require("hardhat");
const { network } = require("hardhat");
require("@nomicfoundation/hardhat-verify");

async function main() {

  // **** Deploy user collection implementation to be cloned
  const userCollection = await hre.ethers.deployContract("UserCollection");
  await userCollection.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionAddress = userCollection.target;

  console.log(
    `UserCollection "origin" deployed to: ${userCollectionAddress}`
  );

  // **************************************** Verify UserCollection on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying contract UserCollection on Etherscan...');
    await verify(userCollectionAddress);
  }

  // **** Deploy SafeTickets
  const safeTickets = await hre.ethers.deployContract("SafeTickets");
  await safeTickets.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const safeTicketsAddress = safeTickets.target;

  console.log(
    `SafeTickets deployed to: ${safeTicketsAddress}`
  );

  // **************************************** Verify SafeTickets on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying SafeTickets contract on Etherscan...');
    await verify(safeTicketsAddress);
  }

  // **** Deploy Marketplace
  const marketplace = await hre.ethers.deployContract("Marketplace", [safeTicketsAddress]);
  await marketplace.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const marketplaceAddress = marketplace.target;

  console.log(
    `Marketplace deployed to: ${marketplaceAddress}`
  );

  // **************************************** Verify Marketplace on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying Marketplace contract on Etherscan...');
    await verify(marketplaceAddress, [safeTicketsAddress]);
  }

  // **** Deploy user collection factory to clone the implementation (calling function createNFTCollection)
  const userCollectionFactory = await hre.ethers.deployContract("UserCollectionFactory", [userCollectionAddress, safeTicketsAddress, marketplaceAddress]);
  await userCollectionFactory.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionFactoryAddress = userCollectionFactory.target;

  console.log(
    `UserCollectionFactory deployed to: ${userCollectionFactoryAddress}`
  );

  // **************************************** Verify UserCollectionFactory on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying contract UserCollectionFactory on Etherscan...');
    await verify(userCollectionFactoryAddress, [userCollectionAddress, safeTicketsAddress, marketplaceAddress]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
