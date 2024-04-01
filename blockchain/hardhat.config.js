require("@nomicfoundation/hardhat-toolbox");
require('hardhat-docgen');
require('dotenv').config()

const ALCHEMY = process.env.ALCHEMY || "";
const PK = process.env.PK || "";
const ETHERSCAN = process.env.ETHERSCAN || "";

module.exports = {
  solidity: "0.8.25",
  networks: {
    sepolia: {
      url: ALCHEMY,
      accounts: [`0x${PK}`],
      chainId: 11155111
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN
  },
};