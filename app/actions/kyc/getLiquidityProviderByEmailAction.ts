"use server"

export async function getLiquidityProviderByEmailAction(email: string) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/getLiquidityProviderByEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ email: email })
        })
        if (!response.ok) {
            throw new Error("Failed to get liquidity provider")
        }
        return response.json()
    } catch (error) {
        console.log(error)
        return null;
    }
}