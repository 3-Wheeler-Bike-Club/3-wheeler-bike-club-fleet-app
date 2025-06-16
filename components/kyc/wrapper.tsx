"use client"

import { useAccount, useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { Invite } from "../kyc/invite"
import { Referred } from "../kyc/referred"
import { Referrer } from "../kyc/referrer"



export function Component() {

    const { address } = useAccount()


    const invitedQueryClient = useQueryClient() 
    const compliantQueryClient = useQueryClient()
    const referrerQueryClient = useQueryClient()
    
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

    const { data: referrer, isLoading: referrerLoading, queryKey: referrerQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isReferrer",
        args: [address!],
    })
    useEffect(() => { 
        referrerQueryClient.invalidateQueries({ queryKey: referrerQueryKey }) 
    }, [blockNumber, referrerQueryClient, referrerQueryKey]) 


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                whitelistedLoading || compliantLoading || referrerLoading
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        {
                            !whitelisted && !referrer && !compliant
                            && (
                                <Invite />
                            )
                        }
                        {
                            referrer && !whitelisted && !compliant
                            && (
                                <Referrer />
                            )
                            
                        }
                        {
                            whitelisted && !referrer && !compliant
                            && (
                                <Referred />
                            )
                            
                        }
                    </>
                )
            }
        </div>
    )
}
