"use client"

import { useAccount, useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Garage } from "./garage"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"


export function Wrapper() {

    const { address } = useAccount()
    const router = useRouter()


    const compliantQueryClient = useQueryClient()
    
    const { data: blockNumber } = useBlockNumber({ watch: true })  


    const { data: compliant, isLoading: compliantLoading, queryKey: compliantQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isCompliant",
        args: [address!],
    })
    useEffect(() => { 
        compliantQueryClient.invalidateQueries({ queryKey: compliantQueryKey }) 
    }, [blockNumber, compliantQueryClient, compliantQueryKey]) 



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
