"use server"


export async function postLiquidityProviderAction(
    address: `0x${string}`,
    email: string,
    phone: string,
) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/postLiquidityProvider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ 
                address: address,
                email: email,
                phone: phone,
            })
        })
        if (!response.ok) {
            throw new Error("Failed to post liquidity provider")
        }
        return response.json()
    } catch (error) { 
        console.log(error)
    }
}