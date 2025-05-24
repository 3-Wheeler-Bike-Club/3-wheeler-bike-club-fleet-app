import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import { useRouter } from "next/navigation";

interface QRProps {
    userId: string;
}

export function QR({ userId }: QRProps) {

    const router = useRouter();

    // Create the SelfApp configuration
    const selfApp = new SelfAppBuilder({
        appName: "3WB P2P Fleet Finance",
        scope: "my-application-scope",
        endpoint: "https://finance.3wb.club/api/verify",
        endpointType: "https",
        userId,
        userIdType: "uuid"
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