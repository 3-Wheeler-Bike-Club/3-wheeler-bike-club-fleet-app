"use server"

export async function getFleetOrdersByAddressAction(address: string) {
    try {
        // Fetch fleet orders from your API
        const res = await fetch(`${process.env.BASE_URL}/api/getFleetOrdersByAddress`, {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                address: address
            })
        })

        
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(`Fleet orders not found`)
            }
            throw new Error('Failed to fetch fleet orders')

        }

        const data = await res.json()
        return data

    } catch (error) {
        console.error(error)
        throw error
    }
}

