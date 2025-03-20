import { OwnerPinkSlipAttestation } from "@/hooks/attestation/useGetOwnerPinkSlipAttestations"
import { CarouselItem } from "../ui/carousel"
import { CardContent } from "../ui/card"
import { Card } from "../ui/card"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useGetHirePurchaseAttestationByVin } from "@/hooks/attestation/useGetHirePurchaseAttestationByVin"
import { useGetHirePurchaseReceiptAttestations } from "@/hooks/attestation/useGetHirePurchaseReceiptAttestations"

interface VinProps {
    ownerPinkSlipAttestation: OwnerPinkSlipAttestation
    ownersPinkSlipAttestations: OwnerPinkSlipAttestation[]
}



export function Vin( {ownerPinkSlipAttestation, ownersPinkSlipAttestations}: VinProps ) {

    const [ownersPinkSlipAttestationsPendingAssignment, setOwnersPinkSlipAttestationsPendingAssignment] = useState<OwnerPinkSlipAttestation[]>([])
    
    useEffect(() => {
        if (ownersPinkSlipAttestations) {
            const filtered = ownersPinkSlipAttestations.filter(ownersPinkSlipAttestation => ownersPinkSlipAttestation.licensePlate !== "0xDEAD" && ownersPinkSlipAttestation.hirePurchaseAttestationID === "0xDEAD")
            setOwnersPinkSlipAttestationsPendingAssignment(filtered)
        }
    }, [ownersPinkSlipAttestations])
    
    const findOwnersPinkSlipAttestationsPendingAssignmentIndex = (ownerPinkSlipAttestation: OwnerPinkSlipAttestation): number => {
        return ownersPinkSlipAttestationsPendingAssignment.findIndex(
            (ownerPinkSlipAttestationPendingAssignment) => ownerPinkSlipAttestationPendingAssignment.ownerPinkSlipAttestationID === ownerPinkSlipAttestation.ownerPinkSlipAttestationID
        );
    }

    const {hirePurchaseAttestation} = useGetHirePurchaseAttestationByVin(ownerPinkSlipAttestation.vin)
    const {hirePurchaseReceiptAttestations} = useGetHirePurchaseReceiptAttestations(hirePurchaseAttestation?.address)

    return (
        <>
            <CarouselItem key={ownerPinkSlipAttestation.vin}>
                <div className="p-1 gap-2 flex flex-col">
                <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image src="/images/kekeHero.svg" alt={ownerPinkSlipAttestation.vin} width={300} height={300} />
                    </CardContent>
                </Card>
                <div className="flex flex-col gap-1 mt-2 text-sm">
                    <div className="flex justify-between items-center">
                    <span className="font-semibold">Vin:</span>
                    <span className="text-right">{ownerPinkSlipAttestation.vin}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="font-semibold">License Plate:</span>
                    <span className="text-right">{ownerPinkSlipAttestation.licensePlate}</span>
                    </div>
                    {
                        ownerPinkSlipAttestation.hirePurchaseAttestationID === "0xDEAD" 
                        ? (
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Queue to Drive:</span>
                                <span className="text-right">{(findOwnersPinkSlipAttestationsPendingAssignmentIndex(ownerPinkSlipAttestation)) + 1}/{ownersPinkSlipAttestationsPendingAssignment.length}</span>
                            </div>
                        )
                        : (
                            <>
                                <div className="flex justify-between items-center">
                                        <span className="font-semibold">Start Date:</span>
                                        <span className="text-right">{hirePurchaseAttestation?.createdAt ? new Date(hirePurchaseAttestation?.createdAt).toLocaleDateString() : "N/A"}</span>
                                </div>  
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Payment Status:</span>
                                    <span className="text-right">{hirePurchaseReceiptAttestations?.length}/93</span>
                                </div>
                            </>
                        )
                    }
                </div>
                </div>
            </CarouselItem>
        </>
    )
}
