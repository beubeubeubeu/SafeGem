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

  // Verify UserCollection on Etherscan
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

  // Verify UserCollectionFactory on Etherscan
  if(!network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY) {
    console.log('Veryfiying contract on Etherscan...');
    await verify(userCollectionFactoryAddress, [userCollectionAddress]);
  }

  // ******** Try to clone a user collection

  // Wrap UserCollectionCreated event listening in a promise
  const cloneAddressPromise = new Promise((resolve) => {
    userCollectionFactory.on("UserCollectionCreated", (_collectionName, _newCollectionAddress, _timestamp, event) => {
      console.log("New collection address is", _newCollectionAddress);
      console.log("New collection name is", _collectionName);
      console.log("New collection block timestamp is", _timestamp);
      event.removeListener();
      resolve(_newCollectionAddress); // Resolve the promise with the address
    });
  });

  // Trigger the transaction
  const tx = await userCollectionFactory.createNFTCollection("My new collection");
  await tx.wait();

  // Wait for the promise to resolve with the clone address
  const cloneAddress = await cloneAddressPromise;
  const cloneContract = await hre.ethers.getContractAt("UserCollection", cloneAddress);
  const greetings = await cloneContract.sayHello();
  console.log("Greetings from clone: " + greetings);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
