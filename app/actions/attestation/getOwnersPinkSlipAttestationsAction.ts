"use server"

export const getOwnersPinkSlipAttestationsAction = async () => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/getOwnersPinkSlipAttestations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
        })
    
        const data = await res.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

