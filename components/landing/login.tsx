"use client";

import { useRouter } from "next/navigation";
import { usePrivy, User } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { LogIn, Wallet, TrendingUp, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function Login() {
    const router = useRouter()
    
    const { ready, authenticated, user } = usePrivy()

    const { login } = useLogin({
        onComplete: ( wasAlreadyAuthenticated ) => {
            setWasAuthenticated(wasAlreadyAuthenticated);        
        }
    })
    const [logging, setLogging] = useState<boolean>(false);
    const [wasAuthenticated, setWasAuthenticated] = useState<User | null>(null);

    useEffect(() => {
        if (logging && wasAuthenticated) {
            setLogging(false)
            //check if user has a profile 
            if (user?.customMetadata) {
                router.replace("/dashboard");
            } else {
                router.replace("/profile");
            }
            
        }
    }, [wasAuthenticated, logging, router, user?.customMetadata]);

    const Login = async () => {
        try {
            setLogging(true)

            if (!authenticated) {
                login()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-8 space-y-12">
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
                <div className="relative w-48 h-48 mb-12">
                    <Image
                        src="/icons/logo.jpg"
                        alt="3WB Logo"
                        fill
                        className="rounded-3xl"
                        priority
                    />
                </div>
                
                <h1 className="text-6xl font-bold mb-6 text-center">Welcome to 3WB Fleet Finance</h1>
                <p className="text-2xl mb-16 text-center max-w-3xl">
                    {"Invest in Africa's three-wheeler future"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-16">
                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <TrendingUp className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">High Returns</h3>
                        <p className="text-center text-sm">Earn up to 2x returns on fleet investments</p>
                    </div>
                    
                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <ShieldCheck className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">Secure Investment</h3>
                        <p className="text-center text-sm">Asset-backed by real three-wheeler fleets</p>
                    </div>

                    <div className="flex flex-col items-center p-8 rounded-2xl border">
                        <Wallet className="w-16 h-16 mb-6" />
                        <h3 className="text-lg text-center font-semibold mb-4">Passive Income</h3>
                        <p className="text-center text-sm">Regular returns from fleet operations</p>
                    </div>
                </div>

                <Button 
                    disabled={!ready} 
                    onClick={Login} 
                    className="w-64 h-16 text-base font-semibold rounded-3xl"
                >
                    <div className="flex w-full items-center justify-center gap-6 px-4">
                        <p>START EARNING</p>
                        <LogIn className="w-6 h-6"/>
                    </div>
                </Button>
            </div>

            <footer className="w-full text-center py-4 text-sm">
                © 2024 3WB Labs Inc. All rights reserved.
            </footer>
        </div>
    );
}