require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('hardhat-docgen');
require('dotenv').config()

// Wallet PK exported from metamask
const WALLET_PK = process.env.WALLET_PK || "3HVBO5BJie9Z2dsbEGDIyNjteJsefCT2ycMBZna0SCT5XkHPuLsuwmEwFEjfr0JZ";
const ALCHEMY = process.env.ALCHEMY_URL || "https://eth-sepolia.g.alchemy.com/v2/drxiWcZkhqopfTB5hGeHEvhxJyaS4nGN";
// const INFURA_URL = process.env.INFURA_URL || "";
const ETHERSCAN = process.env.ETHERSCAN_API_KEY || "75W3K3QY1OT5DVFV9TFAHMQLFZ352N842E";

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