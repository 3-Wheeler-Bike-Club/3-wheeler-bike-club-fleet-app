import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Gift } from "lucide-react";

export function Referrals() {
    return (
        <div className="flex flex-col h-full w-full gap-6">
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <Gift className="h-4 w-4" />
                    <AlertTitle className="font-bold"> Manage Invites!</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">Refer your friends & earn rewards</p>
                        
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}