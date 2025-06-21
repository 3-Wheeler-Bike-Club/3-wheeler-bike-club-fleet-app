import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DoorOpen, UserRoundSearch } from "lucide-react";
import { VerifyKYC } from "./verifyKYC";
import { useAccount } from "wagmi";
import { useGetProfile } from "@/hooks/useGetProfile";
import { VerifyEmail } from "./verifyEmail";

export function Referred() {

    const { address } = useAccount()
  const { profile } = useGetProfile(address!)
  console.log(profile);
    return (
        <div className="flex flex-col h-full w-full gap-6">
            
            <div className="flex w-full justify-center">
                <Alert className="w-full max-w-[66rem]">
                    <DoorOpen className="h-4 w-4" />
                    <AlertTitle className="font-bold">Access Granted!</AlertTitle>
                    <AlertDescription className="text-xs italic">
                        <p className="max-md:text-[11px]">{"You can now complete KYC & access P2P fleet financing"}</p>
                    </AlertDescription>
                </Alert>
            </div>
            <div className="flex w-full h-full justify-center">
                <div className="flex w-full h-full max-w-[66rem] gap-4">
                    <div className="flex flex-col w-full h-full items-center pt-36 max-md:pt-18 gap-4">
                        <UserRoundSearch className="h-40 w-40 max-md:h-30 max-md:w-30 text-yellow-500" />
                        <p className="text-2xl max-md:text-xl text-center font-bold">Verify your Identity.</p>
                        <p className="text-sm max-md:text-xs text-center text-muted-foreground">Complete your KYC options below to access P2P fleet financing.</p>
                        {
                            profile?.email ? <VerifyKYC address={address!} profile={profile} /> : <VerifyEmail address={address!} profile={profile} />
                        }
                    </div>
                    
                </div>
            </div>

        </div>
    )
}
