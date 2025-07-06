import { NextApiRequest, NextApiResponse } from 'next';
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
  

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    
    
    try {
        const { attestationId, proof, pubSignals, userContextData } = req.body;
        console.log("attestationId", attestationId);
        console.log("proof", proof);
        console.log("pubSignals", pubSignals);
        console.log("userContextData", userContextData);


        if (!proof || !pubSignals) {
            return new Response("Proof and publicSignals are required", { status: 400 });
        }

        

       

        // Verify the proof
        const result = await selfBackendVerifier.verify(
            attestationId,
            proof,
            pubSignals,
            userContextData
        );
        
        if (result.isValidDetails.isValid) {
            // Return successful verification response
            return res.status(200).json({
            status: 'success',
            result: true,
            credentialSubject: result.discloseOutput
            });
        } else {
            // Return failed verification response
            return res.status(400).json({
            status: 'error',
            result: false,
            message: 'Verification failed',
            details: result.isValidDetails
            });
        }
    } catch (error) {
          
        console.error('Error verifying proof:', error);
        return res.status(500).json({
            status: 'error',
            result: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}