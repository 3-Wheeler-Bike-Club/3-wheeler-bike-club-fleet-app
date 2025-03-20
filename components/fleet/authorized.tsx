import { ArrowRightFromLine, Caravan, CircleAlert, DiamondPlus, HandCoins, Warehouse } from "lucide-react";
import { Menu } from "../topnav/menu";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useGetFleetOrdersByAddress } from "@/hooks/offchain/useGetFleetOrdersByAddress";
import { OwnerPinkSlipAttestation, useGetOwnerPinkSlipAttestations } from "@/hooks/attestation/useGetOwnerPinkSlipAttestations";
import { DataTable } from "./dataTable";
import { Columns } from "./columns";
import { useEffect, useState } from "react";
import { CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Carousel } from "../ui/carousel";
import { Vin } from "./vin";


export function Authorized() {

    const router = useRouter();

    const {user} = usePrivy();
    console.log(user)

    const smartWallet = user?.linkedAccounts.find((account) => account.type === 'smart_wallet');
    console.log(smartWallet?.address);

    const {fleetOrdersByAddress} = useGetFleetOrdersByAddress(smartWallet?.address)
    
    const {ownerPinkSlipAttestations} = useGetOwnerPinkSlipAttestations(smartWallet?.address)


    const [ownerPinkSlipAttestationsRegistered , setOwnerPinkSlipAttestationsRegistered] = useState<OwnerPinkSlipAttestation[]>([])
  
    
    useEffect(() => {
        if (ownerPinkSlipAttestations) {
            const filtered = ownerPinkSlipAttestations.filter(ownerPinkSlipAttestation => ownerPinkSlipAttestation.licensePlate !== "0xDEAD")
            setOwnerPinkSlipAttestationsRegistered(filtered)
        }
    }, [ownerPinkSlipAttestations])
    

    return (
        <main className="flex h-full w-full">
            <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
                
                <Menu />

                <div className="flex w-full justify-center">
                    <Alert className="w-full max-w-[66rem]">
                        <Caravan className="h-4 w-4" />
                        <AlertTitle className="font-bold">Fleet!</AlertTitle>
                        <AlertDescription className="text-xs italic">
                            Add fleet and view orders & hire purchase 3 Wheelers.
                        </AlertDescription>
                    </Alert>
                </div>



                <div className="flex w-full items-center justify-center">
                    <div className="flex w-full max-w-[66rem] gap-4">
                        <Card className="w-full max-w-1/2">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <HandCoins className="h-6 w-6" />
                                        <p className="text-lg">Buy a 3-Wheeler</p>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Button 
                                    className="w-full justify-end"
                                    onClick={() => router.push("/fleet/buy")}
                                >
                                    <p>Get Brand New </p>
                                    <ArrowRightFromLine />
                                </Button>

                            </CardContent>

                        </Card>

                        <Card className="w-full max-w-1/2">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <DiamondPlus className="h-6 w-6" />
                                        <p className="text-lg">Add a 3-Wheeler</p>
                                    </div>                                 
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button disabled className="w-full justify-end">
                                    <p>Schedule Visit( Coming Soon )</p>
                                    <ArrowRightFromLine />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    
                </div>

                <div className="flex w-full items-center justify-center">
                    <Separator className="w-full max-w-[66rem]" />
                </div>
                {
                    !fleetOrdersByAddress && (
                        <>
                            <div className="flex flex-col items-center w-full justify-center gap-6">
                                <p>please wait, loading...</p>
                            </div>
                        </>
                    )
                }


                {
                    (fleetOrdersByAddress && fleetOrdersByAddress?.length >= 1) && (ownerPinkSlipAttestations && ownerPinkSlipAttestations?.length >= 1)
                    && (
                        <>
                            <div className="flex flex-col items-center w-full justify-center gap-6">
                                {
                                    ownerPinkSlipAttestationsRegistered.length == 0 && (
                                        <>
                                            <div className="max-w-[66rem] flex flex-col items-center justify-center gap-6">
                                                <Caravan className="h-36 w-36" />
                                                <p className="text-xl font-semibold">Your 3-Wheeler order is being processed, please wait...</p>
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    ownerPinkSlipAttestationsRegistered.length >= 1 && (
                                        <>
                                            <div className="max-w-[66rem] flex flex-col items-center justify-center gap-6">     
                                                <Carousel className="w-full max-w-xs">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                        <Warehouse className="h-5 w-5"/>
                                                        <span className="font-semibold text-xl">3-Wheelers:</span>
                                                        </div>          
                                                        <span className="text-right text-xl">{ownerPinkSlipAttestationsRegistered.length}</span>
                                                    </div>
                                                    
                                                    <CarouselContent>
                                                        
                                                        {Array.from(ownerPinkSlipAttestationsRegistered).map((ownerPinkSlipAttestation) => (
                                                        <Vin key={ownerPinkSlipAttestation.vin} ownerPinkSlipAttestation={ownerPinkSlipAttestation} ownersPinkSlipAttestations={ownerPinkSlipAttestations} />
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious />
                                                    <CarouselNext />
                                                </Carousel>
                                            </div>
                                        </>
                                    )
                                }
                                
                                
                            </div>
                            <div className="flex w-full items-center justify-center">
                                <div className="w-full max-w-[66rem]">
                                    <DataTable columns={Columns} data={fleetOrdersByAddress!} />
                                </div>
                            </div>
                        </>
                    )
                    
                }


                
                {
                    (fleetOrdersByAddress && fleetOrdersByAddress?.length >= 1) && (ownerPinkSlipAttestations && ownerPinkSlipAttestations?.length == 0)
                    && (
                        <>
                            <div className="flex flex-col items-center w-full justify-center gap-6">
                                <div className="max-w-[66rem] flex flex-col items-center justify-center gap-6">
                                    <Caravan className="h-36 w-36" />
                                    <p className="text-xl font-semibold">Your 3-Wheeler order is being processed, please wait...</p>
                                </div>
                            </div> 
                            <div className="flex w-full items-center justify-center">
                                <div className="w-full max-w-[66rem]">
                                    <DataTable columns={Columns} data={fleetOrdersByAddress!} />
                                </div>
                            </div>
                            
                        </> 
                    )
                    
                }


                {
                    (fleetOrdersByAddress && fleetOrdersByAddress?.length == 0) && (ownerPinkSlipAttestations && ownerPinkSlipAttestations?.length == 0)
                    && (
                        <div className="flex w-full items-center justify-center">
                            <div className="max-w-[66rem] flex flex-col items-center justify-center gap-6">
                                <p className="text-xl font-semibold">No vehicles found, please add/buy a 3-Wheeler.</p>
                                <CircleAlert className="h-36 w-36" />
                                <p className="text-xl font-semibold">Your fleet is empty, your orders will appear here.</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </main>



    )
}

/**
 



 */