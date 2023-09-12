import { Contract } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: Contract
          let deployer: any
          const sentValue = ethers.parseEther("1")

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("Fund and Withdraw", async () => {
              await fundMe.fund({ value: sentValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(await fundMe.getAddress())

              assert.equal(endingBalance.toString(), "0")
          })
      })
