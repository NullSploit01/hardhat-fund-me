import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains, networkConfig } from "../helper-hardhat-config"
import { verify } from '../utils/verify'
import "dotenv/config"

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
        waitConfirmations: networkConfig[chainId]["blockConfirmations"] || 1
    })
    console.log("Contract deployed to:", fundMe.address)  
    
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, [ethUsdPriceFeed])
    }
}
export default deployFunction
deployFunction.tags = ["all", "fundme"]
