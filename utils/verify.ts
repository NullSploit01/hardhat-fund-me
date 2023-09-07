import { run } from 'hardhat';

export const verify = async (contractAddress: string, args: any) => {
    console.log("Verifying contract at address: ", contractAddress);

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error: any) {
        if (error.message.includes("already verified")) {
            console.log("Contract source code already verified");
        } else {
            console.log("Failed to verify contract");
            console.log(error);
        }
    }
}