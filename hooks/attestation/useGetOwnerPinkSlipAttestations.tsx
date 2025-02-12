
import { getOwnerPinkSlipAttestationsAction } from "@/app/actions/attestation/getOwnerPinkSlipAttestationsAction"
import { useState, useEffect } from "react"

export interface OwnerPinkSlipAttestation {
    _id: string
    ownerPinkSlipAttestationID: string
    vin: string
    make: string
    model: string
    year: number
    color: string
    country: string
    visualProof: string[]
    ownerProof: string
    transferProof: string
}


export const useGetOwnerPinkSlipAttestations = (address: string | undefined) => {
    const [ownerPinkSlipAttestations, setOwnerPinkSlipAttestations] = useState<OwnerPinkSlipAttestation[] | null>(null)

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getOwnerPinkSlipAttestations() {
            if (address) {
                setLoading(true);
                try {

                    
                    const data = await getOwnerPinkSlipAttestationsAction(address)
                    setOwnerPinkSlipAttestations(data)
                } catch(err){
                    setError(err)
                }

                setLoading(false)
            }
        }
        getOwnerPinkSlipAttestations()
    },[ address ])


    async function getBackOwnerPinkSlipAttestations() {
        if (address) {
            setLoading(true);
            try {

                
                const data = await getOwnerPinkSlipAttestationsAction(address)
                setOwnerPinkSlipAttestations(data)
            } catch(err){
                setError(err)
            }

            setLoading(false)
        }
    }

    return {ownerPinkSlipAttestations, loading, error, getBackOwnerPinkSlipAttestations}
}