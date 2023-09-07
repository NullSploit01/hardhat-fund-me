import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"

const deployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deployer } = await getNamedAccounts()

    const { deploy, log } = deployments
    const chainId = network.config.chainId || 31337

    let ethUsdPriceFeed

    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeed = ethUsdAggregator.address
    } else {
        ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeed],
        log: true,
    })
    console.log("Contract deployed to:", fundMe.address)   
}
export default deployFunction
deployFunction.tags = ["all", "fundme"]
