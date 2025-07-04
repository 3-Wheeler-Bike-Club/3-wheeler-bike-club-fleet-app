import SelfQRcodeWrapper, { countries, SelfAppBuilder } from "@selfxyz/qrcode";
import { useRouter } from "next/navigation";

interface QRProps {
    userId: string;
}

export function QR({ userId }: QRProps) {

    const router = useRouter();

    // Create the SelfApp configuration
    const selfApp = new SelfAppBuilder({
        appName: "3WB P2P Fleet Finance",
        scope: "3wb-p2p-fleet-finance",
        endpoint: "https://finance.3wb.club/api/verify",
        endpointType: "https",
        userId,
        userIdType: "uuid",
        disclosures: {
            minimumAge: 18,
            excludedCountries: [
                countries.UNITED_STATES,
                countries.CUBA,
                countries.IRAN,
                countries.NORTH_KOREA,
                countries.RUSSIA,
                countries.UKRAINE,
            ],
            ofac: true,
            nationality: true,
            expiry_date: true,
        }
    }).build();

    return (
        <SelfQRcodeWrapper
            selfApp={selfApp}
            onSuccess={() => {
                // Handle successful verification
                console.log("Verification successful!");
                // Redirect or update UI
                router.push("/fleet");
            }}
            size={360}
        />
    )
}