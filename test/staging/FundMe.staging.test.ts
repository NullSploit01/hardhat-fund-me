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
})
