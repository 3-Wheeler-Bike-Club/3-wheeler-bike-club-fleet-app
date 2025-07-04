import { countries, getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";

export async function POST(req: Request) {
    try {
        const { proof, publicSignals } = await req.json();

        if (!proof || !publicSignals) {
            return new Response("Proof and publicSignals are required", { status: 400 });
        }

        // Initialize and configure the verifier
        const selfBackendVerifier = new SelfBackendVerifier(
            "https://forno.celo.org",
            "3wb-p2p-fleet-finance", 
            "uuid",
            false
        )
        .setMinimumAge(18)
        .excludeCountries(
            countries.UNITED_STATES,
            countries.CUBA,
            countries.IRAN,
            countries.NORTH_KOREA,
            countries.RUSSIA,
            countries.UKRAINE,
        )
        .enableNameAndDobOfacCheck()
        .enableNameAndYobOfacCheck()
        .enablePassportNoOfacCheck()
        ;

        // Verify the proof
        const result = await selfBackendVerifier.verify(proof, publicSignals);
        console.log("Verification Result:", result);
        console.log("Credential Subject:", result.credentialSubject);
        
        if (result.isValid) {
            // Return successful verification response
            
            return new Response(JSON.stringify({
                status: "success",
                result: result.isValid,
                credentialSubject: result.credentialSubject
            }), { status: 200 });
        } else {
            // Return failed verification response
            
            return new Response(JSON.stringify({
                status: "error",
                result: result.isValid,
                message: "Verification failed",
                details: result.isValidDetails
            }), { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying proof:", error);
        return new Response(JSON.stringify({
            message: "Error verifying proof",
            error: error instanceof Error ? error.message : "Unknown error"
        }), { status: 500 });
    }
}