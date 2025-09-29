import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { publicClient } from "@/utils/client"
import { cUSD, fleetOrderBook } from "@/utils/constants/addresses"
import { getReferralTag, submitReferral } from "@divvi/referral-sdk"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData } from "viem"
import { celo } from "viem/chains"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";


export const useOrderFleetFraction = () => {
  
    const [loadingOrderFleetFraction, setLoadingOrderFleetFraction] = useState(false)
    const { sendTransactionAsync } = useSendTransaction();
    const { chainId } = useAccount()
    const { switchChainAsync } = useSwitchChain()

    const router = useRouter()

    async function orderFleetFraction(account: `0x${string}`, shares: number, ) {
      try {
        setLoadingOrderFleetFraction(true)
        

        const data = encodeFunctionData({
          abi: fleetOrderBookAbi,
          functionName: "orderFleetFraction",
          args: [BigInt(shares), cUSD, account!],
        })
        

        // consumer is your Divvi Identifier
        // generate a referral tag for the user
        const referralTag  = getReferralTag({
          user: account,
          consumer: "0x99342D3CE2d10C34b7d20D960EA75bd742aec468",
        })

        if (chainId !== celo.id) {
          await switchChainAsync({ chainId: celo.id })
        }
        
        //Send the transaction your dapp was already going to perform (e.g. swap, transfer, contract interaction), but add the referral tag to the `data` field to enable attribution tracking.
        const hash = await sendTransactionAsync({
          to: fleetOrderBook,
          data: data + referralTag as `0x${string}`,
          value: BigInt(0),
          chainId: celo.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })

        // Report the transaction to Divvi by calling `submitReferral`. Divvi will later decode the referral metadata from the transaction data and record the referral on-chain via the DivviRegistry contract.
        if (transaction) {
          await submitReferral({
            txHash: hash,
            chainId: celo.id
          })
        }
        setLoadingOrderFleetFraction(false) 
        //success toast
        toast.success("Purchase successful", {
            description: `You can now view your 3-Wheeler ${shares == 50 ? "" : `${shares > 1 ? "fractions" : "fraction"}`} in your fleet`,
        })
        router.push("/fleet")
      } catch (error) {
        console.log(error)
        setLoadingOrderFleetFraction(false)
        toast.error("Purchase failed", {
          description: `Something went wrong, please try again`,
      })
      }   
    }
    return { orderFleetFraction, loadingOrderFleetFraction }
  
}