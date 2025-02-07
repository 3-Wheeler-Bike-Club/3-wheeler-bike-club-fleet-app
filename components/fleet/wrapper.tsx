"use client"

import { usePrivy } from "@privy-io/react-auth";
import { Authorized } from "../fleet/authorized";
import { Unauthorized } from "../fleet/unauthorized";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export function Wrapper() {
    const { ready, authenticated, user } = usePrivy()

    const router = useRouter()
    

    useEffect(() => {
        if (!user?.customMetadata) {
            router.replace("/profile")
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
                <>
                    <main className="flex w-full h-full">
                    {
                        authenticated
                        ? <Authorized/>
                        : <Unauthorized/>
                    }
                    </main>
                </>
            )
        }
        </>
    );
}