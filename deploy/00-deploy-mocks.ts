import { HardhatRuntimeEnvironment } from "hardhat/types"
import { network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"

const deployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()

    const { deploy, log } = deployments
    const chainId = network.config.chainId || 31337

    if (developmentChains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [8, 200000000000],
            log: true,
        })

        console.log(
            "----------------------------------------------------------",
        )
    }
}

export default deployFunction
deployFunction.tags = ["all", "mocks"]
