"use server"


export async function updateLiquidityProviderAction(
    address: `0x${string}`,
    firstname: string,
    othername: string,
    lastname: string,
    national: string[],
    verification: string
) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/updateLiquidityProvider`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ 
                address: address,
                firstname: firstname,
                othername: othername,
                lastname: lastname,
                national: national,
                verification: verification
            })
        })
        if (!response.ok) {
            throw new Error("Failed to update liquidity provider")
        }
        return response.json()
    } catch (error) { 
        console.log(error)
    }
}