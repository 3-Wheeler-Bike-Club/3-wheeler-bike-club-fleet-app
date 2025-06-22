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
import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useGetProfile"



export function Wrapper() {

    const { address } = useAccount()
    const { profile, loading, getProfileSync } = useGetProfile(address!)
    console.log(profile);
    const router = useRouter()  


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


    useEffect(() => {
        console.log(whitelisted, referrer, compliant)

        if (referrer && !whitelisted && compliant) {
            router.replace("/referrals")
        } else if (whitelisted && !referrer && compliant) {
            router.replace("/fleet")
        }
    }, [whitelisted, referrer, compliant])


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                whitelistedLoading || compliantLoading || referrerLoading || loading
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
                                <Referrer profile={profile!} getProfileSync={getProfileSync} />
                            )
                            
                        }
                        {
                            whitelisted && !referrer && !compliant
                            && (
                                <Referred profile={profile!} getProfileSync={getProfileSync} />
                            )
                            
                        }
                    </>
                )
            }
        </div>
    )
}
