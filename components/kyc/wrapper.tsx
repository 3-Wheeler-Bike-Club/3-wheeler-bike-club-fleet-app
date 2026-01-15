"use client"

import { useBlockNumber, useReadContract } from "wagmi"
import { fleetOrderBook } from "@/utils/constants/addresses"
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Menu } from "@/components/top/menu"
import { useRouter } from "next/navigation"
import { useGetLiquidityProvider } from "@/hooks/useGetLiquidityProvider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DoorOpen, PhoneCall, UserRoundCheck, UserRoundSearch } from "lucide-react"
import { VerifyKYC } from "@/components/kyc/verifyKYC"
import { VerifyContact } from "@/components/kyc/verifyContact"
import { usePrivy } from "@privy-io/react-auth"



export function Wrapper() {

    const { user } = usePrivy()
    console.log(user)
    console.log(user?.wallet?.address)
    const address = user?.wallet?.address as `0x${string}`
    
    const { liquidityProvider, loading, getLiquidityProviderSync } = useGetLiquidityProvider(address!)
    console.log(liquidityProvider);
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
                                    <AlertTitle className="font-bold">Welcome to 3 Wheeler Bike Club!</AlertTitle>
                                    <AlertDescription className="text-xs italic">
                                        <p className="max-md:text-[11px]">{"You can now complete KYC & finance a 3-wheeler"}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <div className="flex w-full h-full justify-center">
                                <div className="flex w-full h-full max-w-[66rem] gap-4">
                                    <div className="flex flex-col w-full h-full items-center justify-center max-md:pt-18 gap-4">
                                        
                                        {
                                            liquidityProvider?.address 
                                            ? (
                                                <>
                                                   {
                                                    liquidityProvider?.national && liquidityProvider?.national?.length > 0
                                                    ? (
                                                        <>
                                                            <UserRoundCheck className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                            <p className="text-2xl max-md:text-xl text-center font-bold">KYC submitted successfully.</p>
                                                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Your KYC is pending verification. Please wait while we review your documents.</p>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <UserRoundSearch className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                            <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Identity.</p>
                                                            <p className="text-sm max-md:text-xs text-center text-muted-foreground">Complete your KYC by uploading any of your valid national IDs.</p>
                                                        </>
                                                    )
                                                   }
                                                   <VerifyKYC address={address!} liquidityProvider={liquidityProvider!} getLiquidityProviderSync={getLiquidityProviderSync} />
                                                </>
                                            )
                                            : (
                                                <>
                                                    <PhoneCall className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                                                    <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Contact.</p>
                                                    <p className="text-sm max-md:text-xs text-center text-muted-foreground">Please ensure you have a WhatsApp account linked to your active phone number.</p>
                                                    <VerifyContact address={address!} liquidityProvider={liquidityProvider!} getLiquidityProviderSync={getLiquidityProviderSync} />
                                                </>
                                            )
                                            
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
