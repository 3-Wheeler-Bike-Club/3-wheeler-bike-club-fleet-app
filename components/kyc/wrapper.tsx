"use client"

import { useAccount, useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useGetProfile"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { DoorOpen, UserRoundSearch } from "lucide-react"
import { VerifyKYC } from "./verifyKYC"
import { VerifyContact } from "./verifyContact"



export function Wrapper() {

    const { address } = useAccount()
    const { profile, loading, getProfileSync } = useGetProfile(address!)
    console.log(profile);
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

        if (compliant) {
            router.replace("/fleet")
        }
    }, [compliant])


    return (
        <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
            <Menu/>
            {
                loading || compliantLoading
                ? (
                    <div className="flex h-full justify-center items-center text-2xl font-bold">
                        <p>Loading...</p>
                    </div>
                ) 
                : (
                    <>
                        <div className="flex flex-col h-full w-full">
                            
                            <div className="flex w-full justify-center">
                                <Alert className="w-full max-w-[66rem]">
                                    <DoorOpen className="h-4 w-4" />
                                    <AlertTitle className="font-bold">Access Granted!</AlertTitle>
                                    <AlertDescription className="text-xs italic">
                                        <p className="max-md:text-[11px]">{"You can now complete KYC & access P2P fleet financing & refer your friends"}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <div className="flex w-full h-full justify-center">
                                <div className="flex w-full h-full max-w-[66rem] gap-4">
                                    <div className="flex flex-col w-full h-full items-center justify-center max-md:pt-18 gap-4">
                                        <UserRoundSearch className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                        <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Identity.</p>
                                        {
                                            profile?.files && profile?.files?.length > 0
                                            ? <p className="text-sm max-md:text-xs text-center text-muted-foreground">Your KYC is pending verification. Please wait while we review your documents.</p>
                                            : <p className="text-sm max-md:text-xs text-center text-muted-foreground">Complete your KYC options below to access P2P fleet financing.</p>
                                        }
                                        {
                                            profile?.email ? <VerifyKYC address={address!} profile={profile} getProfileSync={getProfileSync} /> : <VerifyContact address={address!} profile={profile} getProfileSync={getProfileSync} />
                                        }
                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </div>
    )
}
