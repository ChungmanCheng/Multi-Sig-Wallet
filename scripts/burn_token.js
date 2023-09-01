const { getNamedAccounts, deployments, ethers, network } = require("hardhat");


async function main(){

    let deployer = (await getNamedAccounts()).deployer;

    const target_address = deployer.toString();
    const burn_amount = "1000000000000000000";

    const coin = await ethers.getContract("Testcoin", deployer);

    const res = await coin.burn( target_address, burn_amount );

}

main();