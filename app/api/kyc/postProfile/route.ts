// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Profile from "@/model/profile"
import connectDB from "@/utils/db/mongodb"
import { middleware } from "@/utils/db/middleware"

export async function POST(
    req: Request,
) {
    const authResponse = middleware(req)
    if (authResponse.status !== 200) {
        return authResponse
    }

    const { firstname, lastname, othername, email, id, files } = await req.json()
    
    try {
        await connectDB()
        const profile = await Profile.create({ 
            firstname: firstname,
            lastname: lastname,
            othername: othername,
            email: email,
            id: id, 
            files: files 
        })
        return new Response(JSON.stringify(profile))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}