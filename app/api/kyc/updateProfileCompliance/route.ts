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
        
        const { address } = await req.json();

        const profile = await Profile.findOneAndUpdate({address: address}, {
            
            compliant: true
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