import { getUniversalLink } from '@selfxyz/core';
import { SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { useRouter } from "next/navigation";

interface QRProps {
    userId: string;
}

export function QR({ userId }: QRProps) {

    const router = useRouter();

    // Create the SelfApp configuration
    const selfApp = new SelfAppBuilder({
        appName: "3 Wheeler Bike Club",
        scope: "finance-3wb-club",
        endpoint: "https://finance.3wb.club/api/verify",
        endpointType: "https",
        logoBase64: "https://finance.3wb.club/icons/logo.png",
        userId,
        userIdType: "uuid",
        version: 2,
        userDefinedData: "0x" + Buffer.from("default").toString('hex').padEnd(128, '0'),
        disclosures: {
            minimumAge: 18,
        }
    }).build();

    return (
        <SelfQRcodeWrapper
            selfApp={selfApp}
            onError={() => {
                // Handle verification error
                console.log("Verification error!");
            }}
            onSuccess={() => {
                // Handle successful verification
                console.log("Verification successful!");
                // Redirect or update UI
                //router.push("/fleet");
            }}
            size={360}
        />
    )
}