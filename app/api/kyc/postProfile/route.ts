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

    const { address, email } = await req.json()
    
    try {
        await connectDB()
        
        // Check if profile already exists
        const existingAddress = await Profile.findOne({ address })
        if (existingAddress) {
            return new Response(
                JSON.stringify({ error: "Address already exists" }),
                { status: 406 }
            )
        }
        const existingEmail = await Profile.findOne({ email })
        if (existingEmail) {
            return new Response(
                JSON.stringify({ error: "Email already exists" }),
                { status: 409 }
            )
        }
        const profile = await Profile.create({ 
            address: address,
            email: email,
        })
        return new Response(JSON.stringify(profile))
    } catch (error) {
        return new Response(JSON.stringify(error))
    }
}