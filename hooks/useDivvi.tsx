import { publicClient } from "@/utils/client"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData, erc20Abi, maxUint256 } from "viem"
import { celo } from "viem/chains"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";


export const useDivvi = () => {
  
    const [loading, setLoading] = useState(false)
    const { sendTransactionAsync } = useSendTransaction();
    const { chainId } = useAccount()
    const { switchChainAsync } = useSwitchChain()

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
          providers: ["0x0423189886D7966f0DD7E7d256898DAeEE625dca", "0xc95876688026be9d6fa7a7c33328bd013effa2bb"],
        })

        if (chainId !== celo.id) {
          await switchChainAsync({ chainId: celo.id })
        }
        
        const hash = await sendTransactionAsync({
          to: to,
          data: data + dataSuffix as `0x${string}`,
          value: BigInt(0),
          chainId: celo.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })

        // Step 2: Report the transaction to the attribution tracking API
        if (transaction) {
          await submitReferral({
            txHash: hash,
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