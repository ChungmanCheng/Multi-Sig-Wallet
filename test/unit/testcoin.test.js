const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const bigInt = require("big-integer");

!developmentChains.includes(network.name)
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

        describe("Mint", () => {

            it("Test owner mints token", async () => {

                const pre_result = (await coin.balanceOf(deployer.toString())).toString();
                const add_amount = "1000000000000000000";
                await coin.mint(deployer.toString(), add_amount);
                const result = (await coin.balanceOf(deployer.toString())).toString();
                assert.equal(result, bigInt( pre_result ).add(add_amount) );

            });

            it("Test other user mints token", async () => {

                const account2Signer = await ethers.provider.getSigner(accounts[2].address.toString());
                const coin2 = coin.connect( account2Signer );
                await expect( coin2.mint(accounts[2].address.toString(), "1000000000000000000") ).to.be.revertedWith(
                    'Ownable: caller is not the owner'
                );

            });

        });

        describe("Burn", () => {

            it("Test owner burns token", async () => {

                const pre_result = (await coin.balanceOf(deployer.toString())).toString();
                const add_amount = "1000000000000000000";
                await coin.burn(deployer.toString(), add_amount);
                const result = (await coin.balanceOf(deployer.toString())).toString();
                assert.equal(result, bigInt( pre_result ).minus(add_amount));

            });

            it("Test other user burns token", async () => {

                const account2Signer = await ethers.provider.getSigner(accounts[2].address.toString());
                const coin2 = coin.connect( account2Signer );
                await expect( coin2.mint(accounts[2].address.toString(), "1000000000000000000") ).to.be.revertedWith(
                    'Ownable: caller is not the owner'
                );

            });

        });

    });