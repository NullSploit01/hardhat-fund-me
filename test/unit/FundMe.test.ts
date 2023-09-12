import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { Contract } from "ethers"
import { developmentChains } from "../../helper-hardhat-config"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: Contract
          let mockV3Aggregator: Contract
          let deployer: any
          const sentValue = ethers.parseEther("1")

          beforeEach(async () => {
              await deployments.fixture(["all"])
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
          })

          describe("Constructor", async () => {
              it("Sets the aggregator address correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })

          describe("fund", async () => {
              it("Fails if not enough ETH is sent", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
              })

              it("Increments the funders balance", async () => {
                  await fundMe.fund({ value: sentValue })
                  const response = await fundMe.getAddressToAmountFunded(deployer)
                  assert.equal(response.toString(), sentValue.toString())
              })

              it("Adds funder to funders array", async () => {
                  await fundMe.fund({ value: sentValue })
                  const response = await fundMe.getFunder(0)
                  assert.equal(response, deployer)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sentValue })
              })

              it("withdraw ETH from single funder", async () => {
                  // arrange
                  const initialBalance = await ethers.provider.getBalance(await fundMe.getAddress())
                  const initlialDeployerBalance = await ethers.provider.getBalance(deployer)

                  // act
                  const transactionResponse = await fundMe.withdraw()
                  const receipt = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = receipt

                  const gasCost = BigInt(gasUsed || 0) * BigInt(gasPrice || 0)

                  const finalBalance = await ethers.provider.getBalance(await fundMe.getAddress())
                  const finalDeployerBalance = await ethers.provider.getBalance(deployer)

                  // assert
                  assert.equal(finalBalance.toString(), "0")
                  assert.equal(
                      (initialBalance + initlialDeployerBalance).toString(),
                      (finalDeployerBalance + gasCost).toString(),
                  )
              })
          })
      })
