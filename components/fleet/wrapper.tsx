"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Garage } from "@/components/fleet/garage"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { mantleSepoliaTestnet } from "viem/chains"


export function Wrapper() {

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`
    
    const router = useRouter()


    const compliantQueryClient = useQueryClient()
    
    const { data: blockNumber } = useBlockNumber({ watch: true })  


    const { data: compliant, isLoading: compliantLoading, queryKey: compliantQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isLiquidityProviderCompliant",
        args: [address!],
    })
    useEffect(() => { 
        compliantQueryClient.invalidateQueries({ queryKey: compliantQueryKey }) 
    }, [blockNumber, compliantQueryClient, compliantQueryKey]) 
    console.log(compliant)



    useEffect(() => {
        console.log(compliant)

        if (compliant === false) {
            router.replace("/kyc")
        }
    }, [compliant])

    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                compliantLoading 
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        {
                            compliant
                            && (
                                <Garage />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}
