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
        const profiles = await Profile.find({});


        if (!profiles) {
            return new Response(
                JSON.stringify({
                    error: "Profiles not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(profiles),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to fetch fleet orders",
                details: error
            }),
            { status: 500 }
        );

    }
}