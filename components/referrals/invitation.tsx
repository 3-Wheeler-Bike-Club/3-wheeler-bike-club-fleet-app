"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {  ClipboardPen, Eraser,  UserRoundPlus, Send } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { encodeFunctionData, isAddress } from "viem"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { publicClient } from "@/utils/client"
import { celo } from "viem/chains"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { useSendTransaction, useSwitchChain } from "wagmi"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"





export function Invitation() {

    const { chainId } = useAccount()
    const [loading, setLoading] = useState(false)
    const [addresses, setAddresses] = useState<`0x${string}`[]>([])
    console.log(addresses)
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const [valid, setValid] = useState<boolean | null>(null);

    const router = useRouter()

    const { switchChainAsync } = useSwitchChain()
    const { sendTransactionAsync } = useSendTransaction()


    const handlePaste = async () => {
        const clipboardText = await navigator.clipboard.readText();
        if (isAddress(clipboardText)) {
            setReceiverAddress(clipboardText as `0x${string}`);
        } else {
            toast.error("Invalid address", {
                description: `Please enter a valid address`,
            })
        }
    };

    const handleClearInput = () => {
        setReceiverAddress("")
    }; 

    useEffect(()=>{
        const checkAddress = async () => {
            if (!isAddress(receiverAddress)) {
                setValid(false)
                
            } else {
                setValid(true);
            }
        }
        checkAddress()
    },[ receiverAddress ])
    
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
                <div className="flex w-full flex-col gap-2 p-4 pb-0">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input 
                            id="address"
                            value={receiverAddress}
                            placeholder="Paste address"
                            disabled
                            onChange={(e) => {
                                try {
                                    (e.target.value.length >= 1)
                                    ? setReceiverAddress((e.target.value as `0x${string}`))
                                    : setReceiverAddress((e.target.value as `0x${string}`))
                                } catch (error : any) {
                                    console.log(error.message)
                                }
                            }}
                        />
                        <div className="flex items-center">
                            <>
                                {
                                    receiverAddress != "" 
                                    ?<Button variant="ghost" size="icon" onClick={handleClearInput}><Eraser /></Button>
                                    :<Button variant="ghost" size="icon" onClick={handlePaste}><ClipboardPen /></Button>
                                }
                            </>
                            <Button variant="ghost" size="icon" 
                                disabled={!valid}
                                onClick={()=>{
                                    if(valid){
                                        setAddresses([...addresses, receiverAddress as `0x${string}`])
                                        setReceiverAddress("")
                                        toast.success("Address added", {
                                            description: `Address added to your whitelist`,
                                        })
                                    }
                                }}
                            >
                                <UserRoundPlus />
                            </Button>
                        </div>


                    </div>
                </div>       
            </div>
        </DrawerContent>
    </Drawer>
  );
}