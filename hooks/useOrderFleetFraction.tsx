import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { publicClient } from "@/utils/client"
import { USD, fleetOrderBook } from "@/utils/constants/addresses"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData } from "viem"
import { mantleSepoliaTestnet } from "viem/chains"
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
          args: [BigInt(shares), USD, account!],
        })

        if (chainId !== mantleSepoliaTestnet.id) {
          await switchChainAsync({ chainId: mantleSepoliaTestnet.id })
        }
        
        //Send the transaction your dapp was already going to perform (e.g. swap, transfer, contract interaction), but add the referral tag to the `data` field to enable attribution tracking.
        const hash = await sendTransactionAsync({
          to: fleetOrderBook,
          data: data,
          value: BigInt(0),
          chainId: mantleSepoliaTestnet.id
        })
        
        const transaction = await publicClient.waitForTransactionReceipt({
          confirmations: 1,
          hash: hash
        })

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