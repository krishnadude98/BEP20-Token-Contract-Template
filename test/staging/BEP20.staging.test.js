const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe("BEP20", function () {
          let bep20, deployer;
          const chainId = network.config.chainId;

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              BEP20Token = await ethers.getContract("BEP20Token", deployer);
          });

          describe("Functionalities", async function () {
              it("Constructor sets the decimals,name,symbol,totalsupply,owner,funds owner", async function () {
                  const accounts = await ethers.getSigners();
                  let bal = 10 ** 10;
                  const decimals = await BEP20Token.decimals();
                  const totalSupply = await BEP20Token.totalSupply();
                  const symbol = await BEP20Token.symbol();
                  const name = await BEP20Token.name();
                  const getOwner = await BEP20Token.getOwner();

                  assert.equal(symbol.toString(), "HK");
                  assert.equal(name.toString(), "HTOKEN");
                  assert.equal(getOwner, accounts[0].address);
                  assert.equal(totalSupply.toString(), bal.toString());

                  assert.equal(decimals.toString(), "8");
              });

              it("transfer function works", async function () {
                  const accounts = await ethers.getSigners();
                  await new Promise(async function (resolve, reject) {
                      BEP20Token.once("Transfer", async function () {
                          console.log("Transfer event happened");
                          try {
                              const endingbalanceOfAccount1 = await BEP20Token.balanceOf(
                                  accounts[1].address
                              );
                              const endingbalanceOfAccount0 = await BEP20Token.balanceOf(
                                  accounts[0].address
                              );
                              assert.equal(
                                  endingbalanceOfAccount0.toString(),
                                  startingbalanceOfAccount0.sub(10).toString()
                              );
                              assert.equal(
                                  endingbalanceOfAccount1.toString(),
                                  startingbalanceOfAccount1.add(10).toString()
                              );
                              resolve();
                          } catch (error) {
                              console.log(error);
                              reject(e);
                          }
                      });
                      const startingbalanceOfAccount1 = await BEP20Token.balanceOf(
                          accounts[1].address
                      );
                      const startingbalanceOfAccount0 = await BEP20Token.balanceOf(
                          accounts[0].address
                      );
                      const tx = await BEP20Token.connect(accounts[0]).transfer(
                          accounts[1].address,
                          10
                      );
                      await tx.wait(1);
                  });
              });

              it("allowance working fine", async function () {
                  const accounts = await ethers.getSigners();
                  await new Promise(async function (resolve, reject) {
                      BEP20Token.once("Approval", async function () {
                          console.log("Approval event happened");
                          try {
                              const endingallowanceOfAccount1 = await BEP20Token.allowance(
                                  accounts[0].address,
                                  accounts[1].address
                              );

                              assert.equal(
                                  endingallowanceOfAccount1.toString(),
                                  startingallowanceAccount1.add(10).toString()
                              );
                              const tx = await BEP20Token.connect(accounts[0]).decreaseAllowance(
                                  accounts[1].address,
                                  10
                              );
                              await tx.wait(1);

                              resolve();
                          } catch (error) {
                              console.log(error);
                              reject(e);
                          }
                      });
                      const startingallowanceAccount1 = await BEP20Token.allowance(
                          accounts[0].address,
                          accounts[1].address
                      );
                      const tx = await BEP20Token.connect(accounts[0]).approve(
                          accounts[1].address,
                          10
                      );
                      await tx.wait(1);
                  });
              });

              it("transferFrom working fine", async function () {
                  const accounts = await ethers.getSigners();
                  const startingbalanceOfAccount0 = await BEP20Token.balanceOf(accounts[0].address);
                  const startingbalanceOfAccount1 = await BEP20Token.balanceOf(accounts[1].address);
                  const tx = await BEP20Token.connect(accounts[0]).approve(accounts[1].address, 10);
                  await tx.wait(1);

                  await expect(
                      BEP20Token.connect(accounts[1]).transferFrom(
                          accounts[0].address,
                          accounts[1].address,
                          10
                      )
                  )
                      .to.emit(BEP20Token, "Approval")
                      .withArgs(accounts[0].address, accounts[1].address, 0)
                      .then(async () => {
                          console.log("Approval event happened");
                          const endingbalanceOfAccount0 = await BEP20Token.balanceOf(
                              accounts[0].address
                          );
                          const endingbalanceOfAccount1 = await BEP20Token.balanceOf(
                              accounts[1].address
                          );
                          assert.equal(
                              endingbalanceOfAccount0.toString(),
                              startingbalanceOfAccount0.sub(10).toString()
                          );
                          assert.equal(
                              endingbalanceOfAccount1.toString(),
                              startingbalanceOfAccount1.add(10).toString()
                          );
                      });
              });
          });
      });
