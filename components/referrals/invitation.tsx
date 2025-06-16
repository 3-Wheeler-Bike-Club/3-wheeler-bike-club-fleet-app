"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {  Send } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { encodeFunctionData } from "viem"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { publicClient } from "@/utils/client"
import { celo } from "viem/chains"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { useSendTransaction, useSwitchChain } from "wagmi"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"





export function Invitation() {

    const { chainId } = useAccount()
    const [loading, setLoading] = useState(false)
    const [addresses, setAddresses] = useState<`0x${string}`[]>([])
    const router = useRouter()

    const { switchChainAsync } = useSwitchChain()
    const { sendTransactionAsync } = useSendTransaction()


    
    async function addWhitelist() { 
        try {
            setLoading(true)
            if (chainId !== celo.id) {
               await switchChainAsync({ chainId: celo.id })
            }
            const hash = await sendTransactionAsync({
                to: fleetOrderBook,
                data: encodeFunctionData({
                    abi: fleetOrderBookAbi,
                    functionName: "addWhitelisted",
                    args: [addresses],
                }),
                chainId: celo.id,
            })
            const transaction = await publicClient.waitForTransactionReceipt({
                confirmations: 1,
                hash: hash
            })
              
            if (transaction) {
                //success toast
                toast.success("Whitelist successful", {
                    description: `You can now view your invites in your referrals`,
                })
                setLoading(false)
                router.push("/fleet")
            }
        } catch (error) {
            console.log(error)
            toast.error("Whitelist failed", {
                description: `Something went wrong, please try again`,
            })
            setLoading(false)
        }
    }

  return (
    <Drawer>
        <DrawerTrigger asChild>
            <Button
                className="max-w-fit h-12 rounded-xl"
            >
                <Send />
                <p>Send Invites</p>
            </Button> 
        </DrawerTrigger>
        <DrawerContent className="h-full">
            <div className="mx-auto w-full max-w-sm pb-6">
            <DrawerHeader>
                <DrawerTitle>
                    Refer Friends
                </DrawerTitle>
                <DrawerDescription className="max-md:text-[0.9rem]">{"Invite your friends & earn rewards"}</DrawerDescription>
            </DrawerHeader>             
            </div>
        </DrawerContent>
    </Drawer>
  );
}