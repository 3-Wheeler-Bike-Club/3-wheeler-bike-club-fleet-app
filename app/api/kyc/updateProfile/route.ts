import Profile from "@/model/profile";
import connectDB from "@/utils/db/mongodb";
import { middleware } from "@/utils/db/middleware";


export async function POST(
    req: Request,
) {
    const authResponse = middleware(req);
    if (authResponse.status !== 200) {
        return authResponse;
    }

    try {
        await connectDB();
        
        const { address, firstname, othername, lastname, phone, id, files } = await req.json();

        // Check if phone already exists
        const existingPhone = await Profile.findOne({ phone })
        if (existingPhone) {
            return new Response(
                JSON.stringify({ error: "Phone already exists" }),
                { status: 409 }
            )
        }
        const profile = await Profile.findOneAndUpdate({address: address}, {
            
            firstname: firstname,
            othername: othername,
            lastname: lastname,
            phone: phone,
            id: id,
            files: files
        }, { new: true });

        if (!profile) {
            return new Response(
                JSON.stringify({
                    error: "Profile not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(profile),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to update profile",
                details: error
            }),
            { status: 500 }
        );

    }
}