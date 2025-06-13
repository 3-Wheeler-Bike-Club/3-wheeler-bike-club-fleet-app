"use client"

import { useAccount, useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Compliant } from "./compliant"



export function Component() {

    const { address, isConnected } = useAccount()


    const invitedQueryClient = useQueryClient() 
    const compliantQueryClient = useQueryClient()
    
    const { data: blockNumber } = useBlockNumber({ watch: true })  

    const { data: whitelisted, isLoading: whitelistedLoading, queryKey: whitelistedQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isWhitelisted",
        args: [address!],
    })
    useEffect(() => { 
        invitedQueryClient.invalidateQueries({ queryKey: whitelistedQueryKey }) 
    }, [blockNumber, invitedQueryClient, whitelistedQueryKey]) 

    const { data: compliant, isLoading: compliantLoading, queryKey: compliantQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isCompliant",
        args: [address!],
    })
    useEffect(() => { 
        compliantQueryClient.invalidateQueries({ queryKey: compliantQueryKey }) 
    }, [blockNumber, compliantQueryClient, compliantQueryKey]) 


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            {
                whitelistedLoading || compliantLoading 
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                    {
                        !whitelisted 
                        ? (
                            <></>
                        )
                        : (
                            <>
                            {
                                !compliant 
                                ? (
                                    <></>
                                )
                                : (
                                    <Compliant />
                                )
                            }
                            </>
                        )
                    }
                    </>
                )
            }
        </div>
    )
}

