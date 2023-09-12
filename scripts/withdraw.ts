import { Contract } from "ethers"
import { ethers, getNamedAccounts } from "hardhat"

const main = async () => {
    const { deployer } = await getNamedAccounts()
    const fundMe = (await ethers.getContract("FundMe", deployer)) as Contract

    console.log("Withdrawing from Contract", await fundMe.getAddress())
    const response = await fundMe.withdraw()
    await response.wait(1)

    console.log("Withdrawn!")
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
