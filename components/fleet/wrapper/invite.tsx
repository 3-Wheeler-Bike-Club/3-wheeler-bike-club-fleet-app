import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DoorClosedLocked } from "lucide-react";

export function Invite() {
    return (
        <div className="flex flex-col h-full w-full gap-6">
            
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <DoorClosedLocked className="h-4 w-4" />
                    <AlertTitle className="font-bold"> Invite Required!</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">{"You need to be invited to access P2P fleet financing"}</p>
                    </AlertDescription>
                </Alert>
            </div>
            <div className="flex w-full h-full justify-center">
                <div className="flex w-full h-full max-w-[66rem] gap-4">
                    <div className="flex flex-col w-full h-full items-center pt-36 max-md:pt-18 gap-4">
                        <DoorClosedLocked className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                        <p className="text-2xl max-md:text-xl text-center font-bold">Get an Invite.</p>
                        <p className="text-sm max-md:text-xs text-center text-muted-foreground">Join our <a href="https://t.me/threeWB" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">telegram group</a> to get an invite from our community reps.</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
