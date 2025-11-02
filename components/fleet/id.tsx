import { CarouselItem } from "@/components/ui/carousel"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { fleetOrderBook, fleetOrderYield } from "@/utils/constants/addresses"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { fleetOrderYieldAbi } from "@/utils/abis/fleetOrderYield"



interface IdProps {
    fleet: BigInt
}

export function Id( {fleet}: IdProps ) {    

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`

    const isfleetFractionedQueryClient = useQueryClient()
    const fleetSharesQueryClient = useQueryClient()
    const fleetLockPeriodQueryClient = useQueryClient()
    const totalSupplyQueryClient = useQueryClient()
    const fleetOrderStatusQueryClient = useQueryClient()
    const fleetFractionPriceQueryClient = useQueryClient()
    const fleetInitialValuePerOrderQueryClient = useQueryClient()
    const fleetLiquidityProviderExpectedValuePerOrderQueryClient = useQueryClient()
    const { data: blockNumber } = useBlockNumber({ watch: true }) 

    const { data: isfleetFractioned, queryKey: isfleetFractionedQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "getFleetFractioned",
        args: [BigInt(Number(fleet))],
    })
    useEffect(() => { 
        isfleetFractionedQueryClient.invalidateQueries({ queryKey: isfleetFractionedQueryKey }) 
    }, [blockNumber, isfleetFractionedQueryClient, isfleetFractionedQueryKey]) 


    const { data: fleetShares, queryKey: fleetSharesQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "balanceOf",
        args: [address as `0x${string}`, BigInt(Number(fleet))],
    })
    useEffect(() => { 
        fleetSharesQueryClient.invalidateQueries({ queryKey: fleetSharesQueryKey }) 
    }, [blockNumber, fleetSharesQueryClient, fleetSharesQueryKey]) 


    const { data: totalSupply, queryKey: totalSupplyQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "totalSupply",
        args: [BigInt(Number(fleet))],
    })
    useEffect(() => { 
        totalSupplyQueryClient.invalidateQueries({ queryKey: totalSupplyQueryKey }) 
    }, [blockNumber, totalSupplyQueryClient, totalSupplyQueryKey]) 

    const { data: fleetLockPeriod, queryKey: fleetLockPeriodQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "getFleetLockPeriodPerOrder",
        args: [BigInt(Number(fleet))],
    })
    useEffect(() => { 
        fleetLockPeriodQueryClient.invalidateQueries({ queryKey: fleetLockPeriodQueryKey }) 
    }, [blockNumber, fleetLockPeriodQueryClient, fleetLockPeriodQueryKey]) 


    const { data: fleetOrderStatus, queryKey: fleetOrderStatusQueryKey } = useReadContract({
        address: fleetOrderYield,
        abi: fleetOrderYieldAbi,
        functionName: "getFleetOrderStatusReadable",
        args: [BigInt(Number(fleet))],
    })
    useEffect(() => { 
        fleetOrderStatusQueryClient.invalidateQueries({ queryKey: fleetOrderStatusQueryKey }) 
    }, [blockNumber, fleetOrderStatusQueryClient, fleetOrderStatusQueryKey]) 


    
   
    const { data: fleetFractionPrice, queryKey: fleetFractionPriceQueryKey } = useReadContract({
        abi: fleetOrderBookAbi,
        address: fleetOrderBook,
        functionName: "fleetFractionPrice",
    })
    useEffect(() => { 
        fleetFractionPriceQueryClient.invalidateQueries({ queryKey: fleetFractionPriceQueryKey }) 
    }, [blockNumber, fleetFractionPriceQueryClient, fleetFractionPriceQueryKey]) 


    const { data: fleetInitialValuePerOrder, queryKey: fleetInitialValuePerOrderQueryKey } = useReadContract({
        abi: fleetOrderBookAbi,
        address: fleetOrderBook,
        functionName: "getFleetInitialValuePerOrder",
    })
    useEffect(() => { 
        fleetInitialValuePerOrderQueryClient.invalidateQueries({ queryKey: fleetInitialValuePerOrderQueryKey }) 
    }, [blockNumber, fleetInitialValuePerOrderQueryClient, fleetInitialValuePerOrderQueryKey]) 


    const { data: fleetLiquidityProviderExpectedValuePerOrder, queryKey: fleetLiquidityProviderExpectedValuePerOrderQueryKey } = useReadContract({
        abi: fleetOrderBookAbi,
        address: fleetOrderBook,
        functionName: "getFleetLiquidityProviderExpectedValuePerOrder",
    })
    useEffect(() => { 
        fleetLiquidityProviderExpectedValuePerOrderQueryClient.invalidateQueries({ queryKey: fleetLiquidityProviderExpectedValuePerOrderQueryKey }) 
    }, [blockNumber, fleetLiquidityProviderExpectedValuePerOrderQueryClient, fleetLiquidityProviderExpectedValuePerOrderQueryKey]) 
    
    return (
        <>
            <CarouselItem key={Number(fleet)}>
                <div className="p-1">
                    <Card className="bg-[url('/images/dodo.svg')] bg-center bg-cover">
                        <CardContent className="flex items-center justify-center p-6">
                        <Image src="/images/kekeHero.svg" alt={""} width={500} height={500} />
                        </CardContent>
                    </Card>
                    <div className="flex flex-col gap-1 mt-2 text-base">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Fleet ID:</span>
                            <span className="text-right">{Number(fleet)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Fleet Status:</span>
                            <span className="text-right">{fleetOrderStatus}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Ownership:</span>
                            <span className="text-right">{isfleetFractioned ? "Fractioned" : "Full"}</span>
                        </div>
                        {
                            isfleetFractioned && (
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Shares:</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-right font-bold">{fleetShares}</span>
                                        <span className="text-muted-foreground"> / </span>
                                        <span className="text-right font-semibold italic">{totalSupply}</span>
                                        <span className="text-muted-foreground"> / </span>
                                        <span className="text-muted-foreground italic">50</span>
                                    </div>
                                </div>
                            )
                        }
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Capital:</span>
                            <span className="text-right"><span className="font-bold text-muted-foreground">$ </span>{isfleetFractioned ? `${fleetLiquidityProviderExpectedValuePerOrder! / fleetShares!}` : `${Number(fleetLiquidityProviderExpectedValuePerOrder!)}`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Yield Period:</span>
                            <span className="text-right">{Number(fleetLockPeriod)} weeks</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Start Date:</span>
                            <span className="text-right italic">pending assignment...</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Weekly ROI:</span>
                            <span className="text-right"><span className="font-bold text-muted-foreground" >$</span> {isfleetFractioned ? `${((( Number(fleetLiquidityProviderExpectedValuePerOrder!) / Number(fleetShares!) ) * 1.45) / Number(fleetLockPeriod)).toFixed(4)}` : `${(( (Number(fleetLiquidityProviderExpectedValuePerOrder!)) * 1.45 ) / Number(fleetLockPeriod)).toFixed(4)}`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total ROI <span className="text-muted-foreground italic text-yellow-800">(45%)</span>:</span>
                            <span className="text-right"><span className="font-bold text-muted-foreground" >$</span> {isfleetFractioned ? `${ (( Number(fleetLiquidityProviderExpectedValuePerOrder!) / Number(fleetShares!) ) * 1.45).toFixed(2) }` : `${ (( Number(fleetLiquidityProviderExpectedValuePerOrder!) ) * 1.45).toFixed(2) }`}</span>
                        </div>
                    </div>
                </div>
            </CarouselItem>
        </>
    )
}
