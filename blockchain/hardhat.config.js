require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('hardhat-docgen');
require('dotenv').config()

// Wallet PK exported from metamask
const WALLET_PK = process.env.WALLET_PK || "";
const ALCHEMY = process.env.ALCHEMY_URL || "";
// const INFURA_URL = process.env.INFURA_URL || "";
const ETHERSCAN = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: "0.8.25",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: ALCHEMY,
      accounts: [`0x${WALLET_PK}`],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN
    }
  }
};