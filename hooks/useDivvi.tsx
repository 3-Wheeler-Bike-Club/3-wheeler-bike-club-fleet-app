import { publicClient } from "@/utils/client"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { createWalletClient, encodeFunctionData, erc20Abi, http, maxUint256 } from "viem"
import { celo } from "viem/chains"
import { useSendTransaction } from "wagmi"


export const useDivvi = () => {
  
    const [loading, setLoading] = useState(false)
    const { sendTransactionAsync } = useSendTransaction()

    async function registerUser(account: `0x${string}`, to: `0x${string}`) {
      try {
        setLoading(true)
        

        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [fleetOrderBook, maxUint256]
        })
        
        // Step 1: Execute an existing transaction within your codebase with the referral data suffix

        // consumer is your Divvi Identifier
        // providers are the addresses of the Rewards Campaigns that you signed up for on the previous page
        const dataSuffix = getDataSuffix({
          consumer: "0x99342D3CE2d10C34b7d20D960EA75bd742aec468",
          providers: ["0x5f0a55FaD9424ac99429f635dfb9bF20c3360Ab8", "0xB06a1b291863f923E7417E9F302e2a84018c33C5", "0x6226ddE08402642964f9A6de844ea3116F0dFc7e", "0x0423189886D7966f0DD7E7d256898DAeEE625dca"],
        })

        
        const tx = await sendTransactionAsync({
          to: to,
          data: data + dataSuffix as `0x${string}`,
          value: BigInt(0),
          chainId: celo.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: tx
        })

        // Step 2: Report the transaction to the attribution tracking API
        if (transaction) {
          await submitReferral({
            txHash: tx,
            chainId: celo.id
          })
        }
        setLoading(false) 
        toast.info("Approval successful", {
          description: "You can now purchase the 3-Wheelers",
        })
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Approval failed", {
          description: `Something went wrong, please try again`,
        })
      }   
    }
    return { registerUser, loading }
  
}