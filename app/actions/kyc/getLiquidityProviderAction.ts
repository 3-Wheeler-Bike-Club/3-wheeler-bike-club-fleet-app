"use server"

export async function getLiquidityProviderAction(address: string) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/getLiquidityProvider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ address: address })
        })
        if (!response.ok) {
            throw new Error("Failed to get liquidity provider")
        }
        return response.json()
    } catch (error) {
        console.log(error)
    }
}