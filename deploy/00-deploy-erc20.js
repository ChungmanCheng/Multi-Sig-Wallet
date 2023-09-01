
const { network, ethers } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");


module.exports = async function({ getNamedAccounts, deployments }){

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let coin;

    coin = await deploy("Testcoin", {
        from: deployer,
        args: ["1000000000000000000"],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    console.log("----------------------------------------------------");

    console.log("Testcoin deployed to:", coin.address);

    console.log("----------------------------------------------------");

}

module.exports.tags = ["all", "testcoin"];