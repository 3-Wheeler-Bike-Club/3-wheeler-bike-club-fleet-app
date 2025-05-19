"use client"

import { useRouter } from "next/navigation";
import { useAccount, useBlockNumber, useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChartPie, Ellipsis, Minus, Plus, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { USDT_ADAPTER, divvi, /*cUSD,*/ fleetOrderBook } from "@/utils/constants/addresses";
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook";
import { erc20Abi } from "viem";
import { celo, optimism } from "viem/chains";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { divviAbi } from "@/utils/abis/divvi";
import { useDivvi } from "@/hooks/useDivvi";




export function Wrapper() {

    const { address } = useAccount()

    const [amount, setAmount] = useState(1)
    const [fractions, setFractions] = useState(1)
    const [loadingCeloUSD, setLoadingCeloUSD] = useState(false)
    const [isFractionsMode, setIsFractionsMode] = useState(true)

    const router = useRouter()
    
    const { writeContractAsync } = useWriteContract()

    const fleetFractionPriceQueryClient = useQueryClient()
    const allowanceCeloDollarQueryClient = useQueryClient()
    const isUserReferredToProviderQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const { registerUser, loading } = useDivvi()



    //increase and decrease amount...
    const increase = () => setAmount((prev) => prev + 1);
    const decrease = () => setAmount((prev) => (prev > 1 ? prev - 1 : 1));
    //..and fractions
    const increaseFractions = () => {
        setFractions((prev) => {
            const newValue = prev + 1;
            if (newValue >= 50) {
                setIsFractionsMode(false);
                return 50;
            }
            return newValue;
        });
    };
    const decreaseFractions = () => setFractions((prev) => (prev > 1 ? prev - 1 : 1));

    
   
    const { data: fleetFractionPrice, queryKey: fleetFractionPriceQueryKey } = useReadContract({
        abi: fleetOrderBookAbi,
        address: fleetOrderBook,
        functionName: "fleetFractionPrice",
    })
    useEffect(() => { 
        fleetFractionPriceQueryClient.invalidateQueries({ queryKey: fleetFractionPriceQueryKey }) 
    }, [blockNumber, fleetFractionPriceQueryClient, fleetFractionPriceQueryKey]) 



    const { data: allowanceCeloUSD, isLoading: allowanceCeloDollarLoading, queryKey: allowanceCeloDollarQueryKey } = useReadContract({
        abi: erc20Abi,
        address: "0x74869c892C9f64AC650e3eC13F6d07C0f21007a6"/*cUSD*/,
        functionName: "allowance",
        args: [address!, fleetOrderBook],
    })
    useEffect(() => { 
        allowanceCeloDollarQueryClient.invalidateQueries({ queryKey: allowanceCeloDollarQueryKey }) 
    }, [blockNumber, allowanceCeloDollarQueryClient, allowanceCeloDollarQueryKey])
    console.log(allowanceCeloUSD)


    const { data: isUserReferredToProvider, queryKey: isUserReferredToProviderQueryKey } = useReadContract({
        abi: divviAbi,
        address: divvi,
        functionName: "isUserReferredToProvider",
        chainId: optimism.id,
        args: [address!, "0x0423189886D7966f0DD7E7d256898DAeEE625dca"],

    })
    useEffect(() => { 
        isUserReferredToProviderQueryClient.invalidateQueries({ queryKey: isUserReferredToProviderQueryKey }) 
    }, [blockNumber, isUserReferredToProviderQueryClient, isUserReferredToProviderQueryKey]) 
    console.log(isUserReferredToProvider!)


   


    // order multiple fleet with celoUSD
    async function orderFleetWithCeloUSD() { 
        try {
            setLoadingCeloUSD(true)
            writeContractAsync({
                abi: fleetOrderBookAbi,
                address: fleetOrderBook,
                chainId: celo.id,
                feeCurrency: USDT_ADAPTER,
                functionName: "orderFleet",
                args: [BigInt(amount), "0x74869c892C9f64AC650e3eC13F6d07C0f21007a6"/*cUSD*/],
            },{
                onSuccess() {
                    //success toast
                    toast.success("Purchase successful", {
                        description: `You can now view your ${amount > 1 ? "3-Wheelers" : " 3-Wheeler"} in your fleet`,
                    })
                    setLoadingCeloUSD(false)
                    router.push("/fleet")
                },
                onError(error) {
                    console.log(error)
                    toast.error("Purchase failed", {
                        description: `Something went wrong, please try again`,
                    })
                    setLoadingCeloUSD(false)
                }
            });
        } catch (error) {
            console.log(error)
            setLoadingCeloUSD(false)
        }
    }


    // order fleet fractions & single 3-Wheeler with celoUSD
    async function orderFleetFractionsWithCeloUSD( shares: number ) {    
        try {
            setLoadingCeloUSD(true)
            writeContractAsync({
                abi: fleetOrderBookAbi,
                address: fleetOrderBook,
                chainId: celo.id,
                feeCurrency: USDT_ADAPTER,
                functionName: "orderFleetFraction",
                args: [BigInt(shares), "0x74869c892C9f64AC650e3eC13F6d07C0f21007a6"/*cUSD*/],
            },{
                onSuccess() {
                    //success toast
                    toast.success("Purchase successful", {
                        description: `You can now view your 3-Wheeler ${shares == 50 ? "" : `${shares > 1 ? "fractions" : "fraction"}`} in your fleet`,
                    })

                    setLoadingCeloUSD(false)
                    router.push("/fleet")
                },
                onError(error) {
                    console.log(error)
                    toast.error("Purchase failed", {
                        description: `Something went wrong, please try again`,
                    })
                    setLoadingCeloUSD(false)
                }
            });
        } catch (error) {
            console.log(error)
            setLoadingCeloUSD(false)
        }
    }

    return (
        <div className="flex flex-col w-full h-full items-center gap-8 p-24 max-md:p-6">

        <Drawer open={true}>
      
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm pb-6">
                    <DrawerHeader className="max-md:gap-[0.1rem]">
                        <DrawerTitle>
                            {isFractionsMode ? "Purchase 3-Wheeler Fractions" : "Purchase a 3-Wheeler"}
                        </DrawerTitle>
                        <DrawerDescription className="text-xs">Choose the amount of {isFractionsMode ? "fractions" : "3-Wheelers"} to purchase.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-2 p-4 pb-0">
                        
                        <div className="flex items-center justify-center space-x-2">
                            <div>
                                <Image className="max-md:w-[80px] max-md:h-[80px]" src="/images/kekeHero.svg" alt="3-Wheeler" width={100} height={100} />
                            </div>
                            <div className="text-xl font-bold">
                                ~
                            </div>
                            <div className="text-xl font-bold">
                                {isFractionsMode ? Math.ceil(fractions * ( Number(fleetFractionPrice) )) : Math.ceil(amount * (Number(fleetFractionPrice) * 50))} <span className="text-muted-foreground">USD</span>
                            </div>
                        </div>  


                    <div>
                            <div className="flex items-center justify-between space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={isFractionsMode ? decreaseFractions : decrease}
                                    disabled={isFractionsMode ? fractions <= 1 : amount <= 1}

                                >
                                    <Minus />
                                    <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="flex-1 text-center">
                                        
                                        <div className="text-7xl max-md:text-5xl font-bold tracking-tighter">
                                        {isFractionsMode ? fractions : amount}
                                        </div>
                                        <div className="text-[0.70rem] max-md:text-[0.6rem] uppercase text-muted-foreground">
                                            No. of {isFractionsMode ? "Fractions" : "3-Wheelers"}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={isFractionsMode ? increaseFractions : increase}
                                    disabled={isFractionsMode ? fractions >= 50 : amount >= 3}
                                >
                                    <Plus />
                                    <span className="sr-only">Increase</span>

                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 py-14 px-4 pb-6">
                            <div className="flex w-full justify-between">
                                
                                {/**pay with celoUSD */}
                                <Button 
                                    className={` ${allowanceCeloUSD && allowanceCeloUSD > 0 ? "w-full hover:bg-yellow-600" : "w-full bg-yellow-300 hover:bg-yellow-400"}` }
                                    disabled={loadingCeloUSD  || loading} 
                                    onClick={() => {
                                        if (allowanceCeloUSD && allowanceCeloUSD > 0) {
                                            if (isFractionsMode) {
                                                orderFleetFractionsWithCeloUSD(fractions)
                                            } else {
                                                orderFleetWithCeloUSD()
                                            }
                                        } else {
                                            if (!isUserReferredToProvider) {
                                                registerUser(address!, "0x74869c892C9f64AC650e3eC13F6d07C0f21007a6")
                                            } else {
                                                toast.error("Already approved!", {
                                                    description: "You are have already approved & registered to a provider",
                                                })
                                            }
                                        }
                                    }}
                                >
                                    {
                                        loadingCeloUSD || loading
                                        ? (
                                            <>
                                                <motion.div
                                                    initial={{ rotate: 0 }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                >
                                                    <Ellipsis/>
                                                </motion.div>
                                            </>
                                        )
                                        : (
                                            <>
                                            <>
                                                {
                                                    allowanceCeloDollarLoading ? (
                                                       <></>
                                                    )  
                                                    : (
                                                        <>
                                                            {
                                                                allowanceCeloUSD && allowanceCeloUSD > 0 ? "Pay with cUSD" : "Approve cUSD"
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                                
                                            </>
                                        )
                                    }
                                </Button>
                            </div>
                            <DrawerClose asChild>
                                <Button className="w-full" variant="outline" onClick={() => router.push("/fleet")}>Cancel</Button>
                            </DrawerClose>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="fractions-mode">
                                    {isFractionsMode ? <ChartPie className="h-7 w-7 text-yellow-600"/> : <ChartPie className="h-6 w-6 text-muted-foreground"/>}
                                </Label>
                                <Switch checked={!isFractionsMode} onCheckedChange={() => {
                                    setIsFractionsMode(!isFractionsMode);
                                    setFractions(1);
                                    setAmount(1);
                                }} id="fractions-mode" />
                                <Label htmlFor="single-mode">
                                    {isFractionsMode ? <RefreshCw className="h-6 w-6 text-muted-foreground"/> : <RefreshCw className="h-7 w-7 text-yellow-600"/>}
                                </Label>
                            </div>
                            <div className="text-xs text-muted-foreground max-md:text-[11px] text-center">
                                <p>Toggle between buying fractions or a single 3-Wheeler</p>
                            </div>
                        </div>
                    <DrawerFooter>
                        
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
        
        </div>
    );
}