"use server"


export async function postProfileAction(
    firstname: string,
    lastname: string,
    othername: string,
    email: string,
    id: string,
    files: string
) {
    try {
        const response = await fetch("/api/kyc/postProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.THREEWB_API_KEY
            },
            body: JSON.stringify({ 
                firstname: firstname,
                lastname: lastname,
                othername: othername,
                email: email,
                id: id,
                files: files
            })
        })
        if (!response.ok) {
            throw new Error("Failed to post profile")
        }
        return response.json()
    } catch (error) {
        console.log(error)
    }
}