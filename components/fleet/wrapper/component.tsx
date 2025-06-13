"use client"

import { useAccount, useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"



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
        <div>
            {
                whitelistedLoading || compliantLoading 
                ? <div>Loading...</div> 
                : (
                    <>
                    {}
                    </>
                )
            }
        </div>
    )
}

