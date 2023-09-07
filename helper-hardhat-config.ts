type INetworkConfigValue = {
    name: string
    ethUsdPriceFeed: string
    blockConfirmations: number
}

type INetworkConfig = {
    [key: number]: INetworkConfigValue
}

export const networkConfig: INetworkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmations: 6
    },
}

export const developmentChains = ["hardhat", "localhost"]
