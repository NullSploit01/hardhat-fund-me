import { Contract } from "ethers"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert, expect } from "chai"

describe("FundMe", async () => {
    let fundMe: Contract
    let mockV3Aggregator: Contract
    let deployer: any
    const sentValue = ethers.parseEther("1")

    beforeEach(async () => {
        await deployments.fixture(["all"])
        const fundmeContract = await deployments.get("FundMe")
        const mockV3AggregatorContract = await deployments.get("MockV3Aggregator")
        mockV3Aggregator = await ethers.getContractAt(
            mockV3AggregatorContract.abi,
            mockV3AggregatorContract.address,
        )

        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContractAt(fundmeContract.abi, fundmeContract.address)
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

    // ToDO fix errors
    // describe("withdraw", async () => {
    //     beforeEach(async () => {
    //         await fundMe.fund({ value: sentValue })
    //     })

    //     it("withdraw ETH from single funder", async () => {
    //         // arrange
    //         const initialBalance = await fundMe.getBalance(fundMe.address)
    //         const initlialDeployerBalance = await fundMe.getBalance(deployer)

    //         // act
    //         const transactionResponse = await fundMe.withdraw()
    //         const receipt = await transactionResponse.wait(1)

    //         const finalBalance = await fundMe.getBalance(fundMe.address)
    //         const finalDeployerBalance = await fundMe.getBalance(deployer)

    //         // assert
    //         assert.equal(finalBalance.toString(), 0)
    //         assert.equal(
    //             initialBalance.add(initlialDeployerBalance).toString(),
    //             finalDeployerBalance.add(1).toString(),
    //         )
    //     })
    // })
})
