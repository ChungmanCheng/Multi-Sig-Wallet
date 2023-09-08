require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require("hardhat-deploy");

require("dotenv").config();

const Sepolia_RPC_URL = process.env.Sepolia_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
  

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            chainId: 11155111,
            url: Sepolia_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        }
    },
    solidity: {
        version: "0.8.4",
        settings: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
        
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    mocha: {
        timeout: 500000,
    },
};
