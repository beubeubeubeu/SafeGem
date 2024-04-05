const {  ethers, network, run } = require("hardhat");

async function main() {

  // The idea is to seed the owner user account
  // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // with three cloned collections.

  // Check that we run this locally first
  const liveNetwork = !network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY;
  if (liveNetwork) {
    console.log("This seed script is meant to be run locally.")
    return;
  }

  // This address will remain the same locally
  const userCollectionFactoryAddress ="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const interfaceName = "IUserCollectionFactory";
  const userCollectionFactory = await hre.ethers.getContractAt(interfaceName, userCollectionFactoryAddress)

  const tx1 = await userCollectionFactory.createNFTCollection("Rock");
  await tx1.wait();

  const tx2 = await userCollectionFactory.createNFTCollection("Jazz");
  await tx2.wait();

  const tx3 = await userCollectionFactory.createNFTCollection("Hip-Hop");
  await tx3.wait();

  console.log("Created 3 collections for user 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});