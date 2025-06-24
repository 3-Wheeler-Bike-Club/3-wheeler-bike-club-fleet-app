"use server"

export async function getProfileByPhoneAction(phone: string) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/kyc/getProfileByPhone`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ phone: phone })
        })
        if (!response.ok) {
            throw new Error("Failed to get profile")
        }
        return response.json()
    } catch (error) {
        console.log(error)
        return null;
    }
}