const { ethers } = require("hardhat");
const networkConfig = {
    5: {
        name: "gorelli",
    },
    80001: {
        name: "polygon",
    },
    31337: {
        name: "hardhat",
    },
    97:{
        name: "bnb"
    }
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    networkConfig,
    developmentChains,
};
