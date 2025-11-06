import { getLiquidityProviderAction } from "@/app/actions/kyc/getLiquidityProviderAction"
import { useEffect, useState } from "react"


export interface LiquidityProvider {
    address: `0x${string}`
    email: string
    phone: string
    firstname: string
    othername: string
    lastname: string
    id: string
    files: string[]
    compliant: boolean
}

export const useGetLiquidityProvider = (address: `0x${string}` | undefined) => {
    const [liquidityProvider, setLiquidityProvider] = useState<LiquidityProvider | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        async function getLiquidityProvider() {
            try {
                setLoading(true)
                if (address) {
                    const data = await getLiquidityProviderAction(address)
                    setLiquidityProvider(data)
                    setLoading(false)
                }
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        getLiquidityProvider()
    }, [address])

    const getLiquidityProviderSync = async () => {
        try {
            setLoading(true)
            if (address) {
                const data = await getLiquidityProviderAction(address)
                setLiquidityProvider(data )
                setLoading(false)
            }
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return { liquidityProvider, loading, error, getLiquidityProviderSync }
}