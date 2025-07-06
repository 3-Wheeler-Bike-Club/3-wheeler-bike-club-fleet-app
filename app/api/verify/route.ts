//import { countries, getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { IConfigStorage, VerificationConfig, SelfBackendVerifier, AttestationId } from "@selfxyz/core";

class ConfigStorage implements IConfigStorage {
    async getConfig(configId: string) {
        return {};
    }
  
    async setConfig(id: string, config: VerificationConfig): Promise<boolean> {
      return false;
    }
  
    async getActionId(userIdentifier: string, userDefinedData: string) {
      return "default_config";
    }
}
  

export async function POST(req: Request) {
    
    
    try {
        const { attestationId, proof, pubSignals, userContextData } = await req.json();
        console.log(attestationId, proof, pubSignals, userContextData);

        if (!proof || !pubSignals) {
            return new Response("Proof and publicSignals are required", { status: 400 });
        }

        // Initialize and configure the verifier
        const IdType = {
            Passport: 1,
            EU_ID_Card: 2,
        };

        const allowedIds = new Map();
        allowedIds.set(IdType.Passport, true); // 1 = passport
        allowedIds.set(IdType.EU_ID_Card, true); // 2 = EU ID card (optional)

        // Create configuration storage
        const configStorage = new ConfigStorage();

        // Initialize the verifier
        const selfBackendVerifier = new SelfBackendVerifier(
            "finance-3wb-club",                    // Your app's unique scope
            "https://finance.3wb.club/api/verify",    // The API endpoint of this backend
            false,                             // false = real passports, true = mock for testing
            allowedIds,                        // Allowed document types
            configStorage,                    // Configuration storage implementation
            "uuid"                  // UUID for off-chain, HEX for on-chain addresses
        );

        // Verify the proof
        const result = await selfBackendVerifier.verify(attestationId as AttestationId, proof, pubSignals, userContextData);
        console.log("Verification Result:", result);
        console.log("Credential Subject:", result);
        
        if (result.isValidDetails.isValid) {
            // Return successful verification response
            
            return new Response(JSON.stringify({
                status: "success",
                result: result.isValidDetails.isValid,
                credentialSubject: result.userData
            }), { status: 200 });
        } else {
            // Return failed verification response
            
            return new Response(JSON.stringify({
                status: "error",
                result: result.isValidDetails.isValid,
                message: "Verification failed",
                details: result.isValidDetails
            }), { status: 401 });
        }
    } catch (error) {
        console.error("Error verifying proof:", error);
        return new Response(JSON.stringify({
            message: "Error verifying proof",
            error: error instanceof Error ? error.message : "Unknown error"
        }), { status: 500 });
    }
}