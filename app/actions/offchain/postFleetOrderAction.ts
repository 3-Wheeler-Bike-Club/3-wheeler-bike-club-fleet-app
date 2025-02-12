"use server"

export const postFleetOrderAction = async (address: string, order: string, amount: number, tender: string, reference: string, status: number, ownerPinkSlipAttestationID: string[]) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postFleetOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                address: address,
                order: order,
                amount: amount,
                tender: tender,
                reference: reference,
                status: status,
                ownerPinkSlipAttestationID: ownerPinkSlipAttestationID
            })
        })

        const data = await res.json()
        return data

    } catch (error) {
        console.error(error)
        throw error
    }
}

