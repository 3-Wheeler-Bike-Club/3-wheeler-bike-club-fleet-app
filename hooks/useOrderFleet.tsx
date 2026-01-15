import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { publicClient } from "@/utils/client"
import { USD, fleetOrderBook } from "@/utils/constants/addresses"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { encodeFunctionData } from "viem"
import { mantleSepoliaTestnet } from "viem/chains"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";


export const useOrderFleet = () => {
  
    const [loadingOrderFleet, setLoadingOrderFleet] = useState(false)
    const { sendTransactionAsync } = useSendTransaction();
    const { chainId } = useAccount()
    const { switchChainAsync } = useSwitchChain()

    const router = useRouter()

    async function orderFleet(account: `0x${string}`, amount: number, ) {
      try {
        setLoadingOrderFleet(true)
        

        const data = encodeFunctionData({
          abi: fleetOrderBookAbi,
          functionName: "orderFleet",
          args: [BigInt(amount), USD, account!],
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

        setLoadingOrderFleet(false) 
        toast.success("Purchase successful", {
          description: `You can now view your ${amount > 1 ? "3-Wheelers" : " 3-Wheeler"} in your fleet`,
        })
        router.push("/fleet")
      } catch (error) {
        console.log(error)
        setLoadingOrderFleet(false)
        toast.error("Purchase failed", {
          description: `Something went wrong, please try again`,
      })
      }   
    }
    return { orderFleet, loadingOrderFleet }
  
}