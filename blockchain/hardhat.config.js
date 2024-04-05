require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('hardhat-docgen');
require('dotenv').config()

// Wallet PK exported from metamask
const WALLET_PK = process.env.WALLET_PK || "";
const ALCHEMY = process.env.ALCHEMY_URL || "";
// const INFURA_URL = process.env.INFURA_URL || "";
const ETHERSCAN = process.env.ETHERSCAN_API_KEY || "";

// Horrible workaround to bypass errors on github workflow complaining
// about undefined env variables (tried a bunch of things and couldn't get it
// such as github secrets)
if(process.env.LOCAL) {
  module.exports = {
    solidity: "0.8.25",
    networks: {
      hardhat: {

      },
      localhost: {
        url: "http://127.0.0.1:8545",
        chainId: 31337,
      },
      sepolia: {
        url: ALCHEMY,
        accounts: [`0x${WALLET_PK}`],
        chainId: 11155111
      },
    },
    etherscan: {
      apiKey: {
        sepolia: ETHERSCAN
      }
    }
  };
} else {
  module.exports = {
    solidity: "0.8.25",
    networks: {
      hardhat: {

      },
      localhost: {
        url: "http://127.0.0.1:8545",
        chainId: 31337,
      },
    }
  };
}