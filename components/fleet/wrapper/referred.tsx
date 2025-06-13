import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DoorOpen } from "lucide-react";

export function Referred() {
    return (
        <div className="flex flex-col h-full w-full gap-6">
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <DoorOpen className="h-4 w-4" />
                    <AlertTitle className="font-bold"> Invite Granted!</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">{"You can now complete KYC & access P2P fleet financing"}</p>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
