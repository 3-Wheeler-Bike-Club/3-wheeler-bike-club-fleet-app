import { getProfileAction } from "@/app/actions/kyc/getProfileAction"
import { useEffect, useState } from "react"


export interface Profile {
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

export const useGetProfile = (address: `0x${string}` | undefined) => {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        async function getProfile() {
            try {
                setLoading(true)
                if (address) {
                    const data = await getProfileAction(address)
                    setProfile(data)
                    setLoading(false)
                }
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        getProfile()
    }, [address])

    const getProfileSync = async () => {
        try {
            setLoading(true)
            if (address) {
                const data = await getProfileAction(address)
                setProfile(data )
                setLoading(false)
            }
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return { profile, loading, error, getProfileSync }
}