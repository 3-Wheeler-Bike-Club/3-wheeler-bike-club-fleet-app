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
        
        const { phone } = await req.json();

        const liquidityProvider = await LiquidityProvider.findOne({ phone: phone});

        if (!liquidityProvider) {
            return new Response(
                JSON.stringify({
                    error: "Liquidity provider not found",
                }),
                { status: 404 }
            );
        }


        return new Response(
            JSON.stringify(liquidityProvider),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to fetch liquidity provider",
                details: error
            }),
            { status: 500 }
        );

    }
}