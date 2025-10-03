"use client"

import { Caravan, HandCoins, OctagonMinus, Warehouse } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { useBlockNumber, useReadContract } from 'wagmi'
import { useRouter } from "next/navigation";
import { fleetOrderBook } from "@/utils/constants/addresses";
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook";
import { Logs } from "@/components/fleet/history/logs";
import { CarouselApi, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Carousel } from "@/components/ui/carousel";
import { Id } from "@/components/fleet/id";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Returns } from "@/components/fleet/withdraw/returns";
import { usePrivy } from "@privy-io/react-auth";


export function Garage() {

    const router = useRouter();

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const [progress, setProgress] = useState<number | null>(null)

    useEffect(() => {
        if (!api) {
          return
        }
     
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    
    const { user, ready, authenticated } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`

    const fleetOwnedQueryClient = useQueryClient() 
    const maxFleetOrderPerContainerQueryClient = useQueryClient() 
    const totalFleetOrderPerContainerQueryClient = useQueryClient()
    const lastFleetFractionQuerClient = useQueryClient()
    const totalSupplyQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    // read balance of fleet owned
    const { data: fleetOwned, queryKey: fleetOwnedQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "getFleetOwned",
        args: [ address! ],
    });
    useEffect(() => { 
        fleetOwnedQueryClient.invalidateQueries({ queryKey: fleetOwnedQueryKey }) 
    }, [blockNumber, fleetOwnedQueryClient, fleetOwnedQueryKey]) 

    // read balance of max fleet order
    const { data: maxFleetOrderPerContainer, queryKey: maxFleetOrderPerContainerQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "maxFleetOrderPerContainer",
    });
    useEffect(() => { 
        maxFleetOrderPerContainerQueryClient.invalidateQueries({ queryKey: maxFleetOrderPerContainerQueryKey }) 
    }, [blockNumber, maxFleetOrderPerContainerQueryClient, maxFleetOrderPerContainerQueryKey]) 


    // read balance of total fleet ordered
    const { data: totalFleetOrderPerContainer, queryKey: totalFleetOrderPerContainerQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "totalFleetOrderPerContainer",
    });
    useEffect(() => { 
        totalFleetOrderPerContainerQueryClient.invalidateQueries({ queryKey: totalFleetOrderPerContainerQueryKey }) 
    }, [blockNumber, totalFleetOrderPerContainerQueryClient, totalFleetOrderPerContainerQueryKey]) 

    // read last fleet fraction 
    const { data: lastFleetFractionID, queryKey: lastFleetFractionQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "lastFleetFractionID",
    });
    useEffect(() => { 
        lastFleetFractionQuerClient.invalidateQueries({ queryKey: lastFleetFractionQueryKey }) 
    }, [blockNumber, lastFleetFractionQuerClient, lastFleetFractionQueryKey]) 
    
    // read balance of total fraction
    const { data: totalSupply, queryKey: totalSupplyQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "totalSupply",
        args: [lastFleetFractionID!]
    });
    useEffect(() => { 
        totalSupplyQueryClient.invalidateQueries({ queryKey: totalSupplyQueryKey }) 
    }, [blockNumber, totalSupplyQueryClient, totalSupplyQueryKey]) 

    
    useEffect(() => {
        if (totalSupply) {
            const totalSupplySold = Number(totalSupply) + ((Number(totalFleetOrderPerContainer) - 1) * 50)

            const totalSupplyAvailable = Number(maxFleetOrderPerContainer) * 50

            const value = (totalSupplySold / totalSupplyAvailable) * 100
            setProgress(value)
        }
    }, [totalSupply, totalFleetOrderPerContainer, maxFleetOrderPerContainer])
    
    return (
        <div className="flex flex-col h-full w-full gap-6">
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <Caravan className="h-4 w-4" />
                    <AlertTitle className="font-bold"> Manage Fleet!</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">Pre-order 3-Wheelers & track the returns</p>
                        <div className="flex w-full flex-col gap-2 mt-2">
                            
                            <Progress value={progress} className="w-full h-2" />
                            <div className="flex justify-between text-[0.7rem] text-[9px] text-muted-foreground">
                                <span>{(progress?.toFixed(2))}% complete</span>
                                <span>{Number(maxFleetOrderPerContainer) - Number(totalFleetOrderPerContainer)} units, {50 - Number(totalSupply)} fractions left</span>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>

            <div className="flex w-full items-center justify-center">
                <div className="flex w-full max-w-[66rem] gap-4">
                    <div className="flex w-full gap-2 justify-between">
                        <div/>
                        <div className="flex gap-2">
                            <Button 
                                disabled={!ready || !authenticated}
                                className="max-w-fit h-12 rounded-xl"
                                onClick={() => router.push(`/fleet/buy`)}
                            >
                                <HandCoins />
                                <p>Buy 3-Wheeler</p>
                            </Button>
                            {
                                fleetOwned && fleetOwned.length >= 1 && (
                                    <div className="flex gap-2">
                                        <Logs/>
                                        <Returns/>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full h-full justify-center">
                {
                    !fleetOwned && (
                        <div className="flex w-full max-w-[66rem] gap-4">
                            <div className="flex w-full justify-center">
                                <p>loading...</p>
                            </div>
                        </div>
                    )
                }
                {fleetOwned && fleetOwned.length < 1 && (
                    <div className="flex w-full h-full max-w-[66rem] gap-4">
                        <div className="flex flex-col w-full h-full items-center pt-36 max-md:pt-18 gap-4">
                            <OctagonMinus className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                            <p className="text-2xl max-md:text-xl text-center font-bold">Your fleet is empty.</p>
                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Get fractional or full ownership of a 3-wheeler to start earning.</p>
                        </div>
                    </div>
                    )
                }
                { fleetOwned && fleetOwned.length >= 1 && (
                    <div className="max-w-[66rem] w-full flex flex-col gap-6">
                        <Carousel className="w-full max-md:mb-10" setApi={setApi}>
                            <div className="flex flex-col w-full mt-6 mb-2 px-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Total Fleet</span>            
                                </div>
                                <div className="flex items-center gap-1">
                                    <Warehouse className="h-6 w-6 text-primary"/>~
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-muted-foreground">{current} /</span>
                                        <span className="text-2xl font-bold">{fleetOwned.length}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <CarouselContent>
                                {Array.from(fleetOwned).map((fleet) => (
                                <Id key={fleet} fleet={fleet} />
                                ))}
                            </CarouselContent>
                            <div className="flex absolute top-14 right-14">
                                <CarouselPrevious variant="default"/>
                                <CarouselNext variant="default" />
                            </div>
                        </Carousel>
                    </div>
                )}
                
            </div>
        </div>
    );
}