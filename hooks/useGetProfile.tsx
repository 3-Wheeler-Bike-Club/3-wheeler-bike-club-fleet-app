import { getProfileAction } from "@/app/actions/kyc/getProfileAction"
import { useEffect, useState } from "react"


export interface Profile {
    address: `0x${string}`
    firstname: string
    lastname: string
    othername: string
    email: string
    id: string
    files: string[]
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
                }
            } catch (error) {
                setError(error)
            }
        }
        getProfile()
    }, [address])

    return { profile, loading, error }
}