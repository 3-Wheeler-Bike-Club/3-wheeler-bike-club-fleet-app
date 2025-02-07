"use server"


export async function getCurrencyRateAction(currency: string) {
    try {
        // Fetch currency rate from your API
        const res = await fetch(`${process.env.BASE_URL}/api/getCurrencyRate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": `${process.env.WHEELER_API_KEY}`
            },
            body: JSON.stringify({
                currency: currency
            })
        })

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(`Currency rate not found for ${currency}`)
            }
            throw new Error('Failed to fetch currency rate')
        }

        const data = await res.json()
        return data

    } catch (error) {
        console.error(error)
        throw error
    }
}
