"use server"

export const getOwnerPinkSlipAttestationByVinAction = async (vin: string) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/getOwnerPinkSlipAttestationByVin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                vin: vin
            })
        })
    
        const data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        console.error(error)
    }
}

