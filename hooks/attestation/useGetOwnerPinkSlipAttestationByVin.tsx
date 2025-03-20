
import { getOwnerPinkSlipAttestationByVinAction } from "@/app/actions/attestation/getOwnerPinkSlipAttestationByVinAction"
import { useState, useEffect } from "react"
import { OwnerPinkSlipAttestation } from "./useGetOwnerPinkSlipAttestations"




export const useGetOwnerPinkSlipAttestationByVin = (vin: string | undefined) => {
    const [ownerPinkSlipAttestationByVin, setOwnerPinkSlipAttestationByVin] = useState<OwnerPinkSlipAttestation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getOwnerPinkSlipAttestationByVin() {
           
            if(vin){
                setLoading(true);
                try {
                    
                    const data = await getOwnerPinkSlipAttestationByVinAction(vin)
                    setOwnerPinkSlipAttestationByVin(data)

                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        
        }
        getOwnerPinkSlipAttestationByVin()
    },[vin])


    async function getBackOwnerPinkSlipAttestationByVin() {
        
        if(vin){
            setLoading(true);
            try {
                
                const data = await getOwnerPinkSlipAttestationByVinAction(vin)
                setOwnerPinkSlipAttestationByVin(data)

            } catch(err){
                setError(err)
            }
            setLoading(false)
        }
        
    }

    return {ownerPinkSlipAttestationByVin, loading, error, getBackOwnerPinkSlipAttestationByVin}
}