"use server"

export const getHirePurchaseAttestationByVinAction = async (vin: string) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/getHirePurchaseAttestationByVin`, {
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

