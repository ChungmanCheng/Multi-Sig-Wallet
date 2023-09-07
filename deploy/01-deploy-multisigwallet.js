
const { network, ethers } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");


module.exports = async function({ getNamedAccounts, deployments }){

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let wallet;

    wallet = await deploy("MultiSigWallet", {
        from: deployer,
        args: [["0x32855B4d7ab25A35Dd59C1DA2c39783451625594", "0xA77b98D26584f52c4aD6d6b0d49e04C5059FFe88"],2],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    console.log("----------------------------------------------------");

    console.log("Wallet deployed to:", wallet.address);

    console.log("----------------------------------------------------");

    await verify(wallet.address, [["0x32855B4d7ab25A35Dd59C1DA2c39783451625594", "0xA77b98D26584f52c4aD6d6b0d49e04C5059FFe88"],2]);

}

module.exports.tags = ["all", "multisigwallet"];
