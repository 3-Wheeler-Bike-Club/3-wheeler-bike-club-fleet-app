import LiquidityProvider from "@/model/liquidityProvider";
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
        const liquidityProviders = await LiquidityProvider.find({});


        if (!liquidityProviders) {
            return new Response(
                JSON.stringify({
                    error: "Liquidity providers not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(liquidityProviders),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to fetch liquidity providers",
                details: error
            }),
            { status: 500 }
        );

    }
}