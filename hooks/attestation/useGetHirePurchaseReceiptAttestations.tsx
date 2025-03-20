
import { getHirePurchaseReceiptAttestationsAction } from "@/app/actions/attestation/getHirePurchaseReceiptAttestationsAction";
import { useState, useEffect } from "react"


export interface OffchainHirePurchaseReceiptAttestation {
    address: string;
    hirePurchaseInvoiceAttestationID: string;
    hirePurchaseReceiptAttestationID: string;
    vin: string;
    receiptID: string;
    amount: number;
    currency: string;
    score: number;
}

export const useGetHirePurchaseReceiptAttestations = (address: string | undefined) => {
    const [hirePurchaseReceiptAttestations, setHirePurchaseReceiptAttestations] = useState<OffchainHirePurchaseReceiptAttestation[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getHirePurchaseReceiptAttestation() {
           
            if(address){
                setLoading(true);
                try {
                    
                    const data = await getHirePurchaseReceiptAttestationsAction(address)
                    setHirePurchaseReceiptAttestations(data)

                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        
        }
        getHirePurchaseReceiptAttestation()
    },[address])


    async function getBackHirePurchaseReceiptAttestations() {
        
        if(address){
            setLoading(true);
            try {
                
                const data = await getHirePurchaseReceiptAttestationsAction(address)
                setHirePurchaseReceiptAttestations(data)

            } catch(err){
                setError(err)
            }
            setLoading(false)
        }
        
    }

    return {hirePurchaseReceiptAttestations, loading, error, getBackHirePurchaseReceiptAttestations}
}