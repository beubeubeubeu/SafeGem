require("@nomicfoundation/hardhat-verify");
const {  ethers, network, run } = require("hardhat");

async function main() {

  const liveNetwork = !network.name.includes('localhost') && process.env.ETHERSCAN_API_KEY;

  if(liveNetwork) {
    console.log("========================================================================================")
    console.log("Be sure to have around 0.2 SEPOLIA ETH in your account to pay for gas.")
    console.log("Deployment started...")
    console.log("========================================================================================")
  }

  // **** Deploy user collection implementation to be cloned
  const userCollection = await ethers.deployContract("UserCollection");
  await userCollection.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionAddress = userCollection.target.toString();

  console.log(
    `UserCollection "origin" deployed to: ${userCollectionAddress}`
  );

  // **** Deploy SafeTickets
  const safeTickets = await ethers.deployContract("SafeTickets");
  await safeTickets.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const safeTicketsAddress = safeTickets.target.toString();

  console.log(
    `SafeTickets deployed to: ${safeTicketsAddress}`
  );

  // **** Deploy Marketplace
  const marketplace = await ethers.deployContract("Marketplace", [safeTicketsAddress]);
  await marketplace.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const marketplaceAddress = marketplace.target.toString();

  console.log(
    `Marketplace deployed to: ${marketplaceAddress}`
  );

  // **** Deploy user collection factory to clone the implementation (calling function createNFTCollection)
  const userCollectionFactory = await ethers.deployContract("UserCollectionFactory", [userCollectionAddress, safeTicketsAddress, marketplaceAddress]);
  await userCollectionFactory.deploymentTransaction().wait(network.config.blockConfirmations || 1);
  const userCollectionFactoryAddress = userCollectionFactory.target.toString();

  console.log(
    `UserCollectionFactory deployed to: ${userCollectionFactoryAddress}`
  );

  if(liveNetwork) {
    // ******************* Copy pasted format for Vercel
    console.log("           => copiable PUBLIC env vars for contract addresses for Vercel :")
    console.log(`NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS="${marketplaceAddress}"`)
    console.log(`NEXT_PUBLIC_SAFE_TICKETS_CONTRACT_ADDRESS="${safeTicketsAddress}"`)
    console.log(`NEXT_PUBLIC_USER_COLLECTION_CONTRACT_ADDRESS="${userCollectionAddress}"`)
    console.log(`NEXT_PUBLIC_USER_COLLECTION_FACTORY_CONTRACT_ADDRESS="${userCollectionFactoryAddress}"`)
  }

  // **************************************** Verify SafeTickets on Etherscan
  if(liveNetwork) {
    await verify("SafeTickets", safeTicketsAddress, []);
    await verify("UserCollection", userCollectionAddress, []);
    await verify("Marketplace", marketplaceAddress, [safeTicketsAddress]);
    await verify("UserCollectionFactory", userCollectionFactoryAddress, [userCollectionAddress, safeTicketsAddress, marketplaceAddress]);
  }

  if(liveNetwork) {
    console.log("========================================================================================")
    console.log("For manual verifications:")
    console.log(`yarn hardhat verify --network sepolia "${safeTicketsAddress}"`)
    console.log(`yarn hardhat verify --network sepolia "${userCollectionAddress}"`)
    console.log(`yarn hardhat verify --network sepolia "${marketplaceAddress}" "${safeTicketsAddress}"`)
    console.log(`yarn hardhat verify --network sepolia "${userCollectionFactoryAddress}" "${userCollectionAddress}" "${safeTicketsAddress}" "${marketplaceAddress}"`)
  }
}

const verify = async (contractName, contractAddress, args) => {
  console.log("========================================================================================")
  console.log(`Verifying contract ${contractName} on Etherscan...`);
  try {
    if (args.length > 0) {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args
      });
    } else {
      await run("verify:verify", {
        address: contractAddress
      });
    }
  } catch (e) {
    console.log(e);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
