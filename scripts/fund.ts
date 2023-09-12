import { Contract } from "ethers"
import { ethers, getNamedAccounts } from "hardhat"

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe = (await ethers.getContract("FundMe", deployer)) as Contract

    console.log("Funding Contract", await fundMe.getAddress())
    const response = await fundMe.fund({ value: ethers.parseEther("0.69") })

    await response.wait(1)
    console.log("Funded!")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
