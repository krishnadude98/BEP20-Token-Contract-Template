const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subsriptionId, vrfCoordinatorV2Mock;

  let bal = 10 ** 10;

  const args = ["HTOKEN", "HK", 8, bal];
  const bepToken = await deploy("BEP20Token", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.BNB_API_KEY) {
    console.log("VERIFYING.........");
    await verify(bepToken.address, args);
  }

  console.log("------------------------------------");
};
module.exports.tags = ["all", "beptoken"];
