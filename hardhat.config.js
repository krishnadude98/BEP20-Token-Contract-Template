require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const GORELLI_RPC_URL = process.env.GORELLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;
const API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
const BNB_API_KEY = process.env.BNB_API_KEY;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goreli: {
      url: GORELLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      blockConfirmations: 1,
    },
    polygon_mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/kTZxIUR6MKogwu-aarjjs5euIVls4j0j",
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6,
      chainId: 80001,
    },
    bnb: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [PRIVATE_KEY, PRIVATE_KEY2],
      blockConfirmations: 6,
      chainId: 97,
    },
  },
  solidity: "0.5.16",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: {
      goerli: API_KEY,
      polygonMumbai: POLYGON_API_KEY,
      bscTestnet: BNB_API_KEY,
    },
    customChains: [],
  },

  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
    token: "MATIC",
  },
  mocha: {
    timeout: 400000,
  },
};
