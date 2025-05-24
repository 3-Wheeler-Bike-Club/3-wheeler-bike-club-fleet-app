import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";

export async function POST(req: Request) {
    try {
        const { proof, publicSignals } = await req.json();

        if (!proof || !publicSignals) {
            return new Response("Proof and publicSignals are required", { status: 400 });
        }

        // Extract user ID from the proof
        const userId = await getUserIdentifier(publicSignals);
        console.log("Extracted userId:", userId);

        // Initialize and configure the verifier
        const selfBackendVerifier = new SelfBackendVerifier(
            "3wb-p2p-fleet-finance", 
            "https://finance.3wb.club/api/verify",
            "uuid",
            true
        );

        // Verify the proof
        const result = await selfBackendVerifier.verify(proof, publicSignals);
        
        if (result.isValid) {
            // Return successful verification response
            
            return new Response(JSON.stringify({
                status: "success",
                result: true,
                credentialSubject: result.credentialSubject
            }), { status: 200 });
        } else {
            // Return failed verification response
            
            return new Response(JSON.stringify({
                status: "error",
                result: false,
                message: "Verification failed",
                details: result.isValidDetails
            }), { status: 500 });
        }
    } catch (error) {
        console.error("Error verifying proof:", error);
        return new Response(JSON.stringify({
            status: "error",
            result: false,
            message: error instanceof Error ? error.message : "Unknown error"
        }), { status: 500 });
    }
}