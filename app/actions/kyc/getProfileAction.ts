"use server"

export async function getProfileAction(address: string) {
    try {
        const response = await fetch("/api/kyc/getProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ address: address })
        })
        if (!response.ok) {
            throw new Error("Failed to get profile")
        }
        return response.json()
    } catch (error) {
        console.log(error)
    }
}