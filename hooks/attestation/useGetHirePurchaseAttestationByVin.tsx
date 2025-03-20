
import { getHirePurchaseAttestationByVinAction } from "@/app/actions/attestation/getHirePurchaseAttestationByVinAction";
import { useState, useEffect } from "react"


export interface HirePurchaseAttestation {
    address: string;
    memberBadgeAttestationID: string;
    hirePurchaseAttestationID: string;
    vin: string;
    amount: number;
    installments: number;
    firstDate: string;
    lastDate: string;
    contract: string;
    createdAt: Date;
    updatedAt: Date;
}

export const useGetHirePurchaseAttestationByVin = (vin: string | undefined) => {
    const [hirePurchaseAttestation, setHirePurchaseAttestation] = useState<HirePurchaseAttestation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getHirePurchaseAttestationByVin() {
           
            if(vin){
                setLoading(true);
                try {
                    
                    const data = await getHirePurchaseAttestationByVinAction(vin)
                    setHirePurchaseAttestation(data)

                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        
        }
        getHirePurchaseAttestationByVin()
    },[vin])


    async function getBackHirePurchaseAttestationByVin() {
        
            if(vin){
            setLoading(true);
            try {
                
                const data = await getHirePurchaseAttestationByVinAction(vin)
                setHirePurchaseAttestation(data)

            } catch(err){
                setError(err)
            }
            setLoading(false)
        }
        
    }

    return {hirePurchaseAttestation, loading, error, getBackHirePurchaseAttestationByVin}
}