"use client"

import { usePrivy } from "@privy-io/react-auth";
import { Authorized } from "./authorized";
import { Unauthorized } from "./unauthorized";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Wrapper() {
    const { ready, authenticated, user } = usePrivy()
    const router = useRouter()
    

    useEffect(() => {
        if (user?.customMetadata) {
            router.replace("/fleet")
        }
    }, [user?.customMetadata])
    
    return (
        <>
        {
            !ready 

            ?(
                <>
                    <main className="flex min-h-screen flex-col items-center justify-between p-24">
                        <p>loading....</p>
                    </main>
                </>
            )
            :(
                authenticated
                ? <Authorized/>
                : <Unauthorized/>
            )
        }
        </>
    );
}
