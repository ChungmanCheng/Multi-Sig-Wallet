const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const bigInt = require("big-integer");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Testcoin Unit Tests", async function(){

        let coin, accounts, deployer;

        beforeEach(async function(){
            accounts = await ethers.getSigners();
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            const Coin = await ethers.getContractFactory("Testcoin");
            coin = await Coin.deploy("1000000000000000000");
        });


        describe("Constructor", () => {

            it ("Initializes the Testcoin name correctly", async () => {
                const result = (await coin.name()).toString();
                assert.equal(result, "Testcoin");
            });

            it ("Initializes the Testcoin symbol correctly", async () => {
                const result = (await coin.symbol()).toString();
                assert.equal(result, "Test");
            });

            it ("Initializes the Testcoin initialSupply correctly", async () => {
                const result = (await coin.balanceOf(deployer.toString())).toString();
                assert.equal(result, "1000000000000000000");
            });

        });

    });