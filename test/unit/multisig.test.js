const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const bigInt = require("big-integer");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Multi Sig Wallet Unit Tests", async function(){

        let wallet, accounts, deployer;

        beforeEach(async function(){
            accounts = await ethers.getSigners();
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            const Wallet = await ethers.getContractFactory("MultiSigWallet");
            wallet = await Wallet.deploy( [deployer.toString(), accounts[1].address.toString(), accounts[2].address.toString()], "2" );
        });

        describe("Constructor", () => {
            it("Initializes the owner list correctly", async () => {
                const result = (await wallet.getOwners()).toString();
                assert.equal(result, [deployer.toString(), accounts[1].address.toString(), accounts[2].address.toString()]);
            });
        });

        describe("Submit Transaction", () => {
            it("Deployer submit transaction", async () => {
                const account2Signer = await ethers.provider.getSigner(deployer.toString());
                const Wallet = wallet.connect( account2Signer );
                await Wallet.submitTransaction( accounts[1].address.toString(), 1000000000, "0x00" );
                assert.equal( (await Wallet.getTransactionCount()).toString(), 1);
            });
        });

        describe("Confirm Transaction", () => {

            it("Deployer confirm transaction without confirm", async () => {
                const account2Signer = await ethers.provider.getSigner(deployer.toString());
                const Wallet = wallet.connect( account2Signer );
                await Wallet.submitTransaction( accounts[1].address.toString(), 1000000000, "0x00" );
                await expect( Wallet.executeTransaction("0") ).to.be.revertedWith(
                    'cannot execute tx'
                );
            });

            it("Deployer confirm transaction with 1 confirm", async () => {
                const account2Signer = await ethers.provider.getSigner(deployer.toString());
                const Wallet = wallet.connect( account2Signer );
                await Wallet.submitTransaction( accounts[1].address.toString(), 1000000000, "0x00" );
                await Wallet.confirmTransaction("0");
                await expect( Wallet.executeTransaction("0") ).to.be.revertedWith(
                    'cannot execute tx'
                );
            });

            it("Deployer confirm transaction with 2 confirm", async () => {
                const account2Signer = await ethers.provider.getSigner(deployer.toString());
                const Wallet = wallet.connect( account2Signer );
                // deposit fund
                await ethers.provider.send('eth_sendTransaction', [
                    {
                      from: deployer.toString(),
                      to: await Wallet.getContractAddress(),
                      value: '0x' + Number("1000000000000000000").toString(16),
                    },
                ]);
                const account2Signer2 = await ethers.provider.getSigner(accounts[1].address.toString());
                const Wallet2 = wallet.connect( account2Signer2 );
                await Wallet.submitTransaction( accounts[1].address.toString(), "1000000000000000000", "0x00" );
                await Wallet.confirmTransaction("0");
                await Wallet2.confirmTransaction("0");
                await Wallet.executeTransaction("0");
                var expected = bigInt(await ethers.provider.getBalance(accounts[1].address.toString())).minus(bigInt("10000000000000000000000")).add("100000000000000000").divide("1000000000000000000");
                assert.equal( expected.toString(), bigInt("1000000000000000000").divide("1000000000000000000").toString() );
            });

        });

    });