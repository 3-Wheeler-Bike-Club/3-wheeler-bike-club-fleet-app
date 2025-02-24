"use server"

export const postFleetOrderAction = async (address: string | undefined, invoice: string | undefined, amount: number | undefined, tender: string | undefined, reference: string | undefined, status: number | undefined, ownerPinkSlipAttestationID: string[] | undefined) => {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/postFleetOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                address: address,
                invoice: invoice,
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

