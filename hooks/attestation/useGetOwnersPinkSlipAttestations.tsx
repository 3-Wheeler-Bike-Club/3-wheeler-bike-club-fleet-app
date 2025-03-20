
import { useState, useEffect } from "react"
import { getOwnersPinkSlipAttestationsAction } from "@/app/actions/attestation/getOwnersPinkSlipAttestationsAction"
import { OwnerPinkSlipAttestation } from "./useGetOwnerPinkSlipAttestations"


export const useGetOwnersPinkSlipAttestations = () => {
    const [ownersPinkSlipAttestations, setOwnersPinkSlipAttestations] = useState<OwnerPinkSlipAttestation[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getOwnersPinkSlipAttestations() {
           
            setLoading(true);
            try {
                
                const data = await getOwnersPinkSlipAttestationsAction()
                setOwnersPinkSlipAttestations(data)

            } catch(err){
                setError(err)
            }
            setLoading(false)
        
        }
        getOwnersPinkSlipAttestations()
    },[])


    async function getBackOwnersPinkSlipAttestations() {
        
        setLoading(true);
        try {
            
            const data = await getOwnersPinkSlipAttestationsAction()
            setOwnersPinkSlipAttestations(data)
        } catch(err){
            setError(err)
        }

        setLoading(false)
        
    }

    return {ownersPinkSlipAttestations, loading, error, getBackOwnersPinkSlipAttestations}
}