
import { getFleetOrdersByAddressAction } from "@/app/actions/offchain/getFleetOrdersByAddressAction"
import { useState, useEffect } from "react"


export interface OffchainFleetOrder {
    _id: string
    address: string
    order: string
    amount: number
    tender: string
    reference: string
    status: number
    ownerPinkSlipAttestationID: string[]

}

export const useGetFleetOrdersByAddress = (address: string | undefined) => {
    const [fleetOrdersByAddress, setFleetOrdersByAddress] = useState<OffchainFleetOrder[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)


    useEffect (() =>{
        async function getFleetOrdersByAddress() {
            if (address) {
                setLoading(true);
                try {
                    
                    const data = await getFleetOrdersByAddressAction(address)
                    setFleetOrdersByAddress(data)


                } catch(err){
                    setError(err)
                }
                setLoading(false)
            }
        }
        getFleetOrdersByAddress()
    },[])


    async function getBackFleetOrdersByAddress() {
        if (address) {
            setLoading(true);
            try {

                
                const data = await getFleetOrdersByAddressAction(address)
                setFleetOrdersByAddress(data)
            } catch(err){
                setError(err)
            }

            setLoading(false)  
        }
    }

    return {fleetOrdersByAddress, loading, error, getBackFleetOrdersByAddress}
}