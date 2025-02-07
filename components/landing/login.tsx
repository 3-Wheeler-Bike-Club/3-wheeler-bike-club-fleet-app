"use client";

import { useRouter } from "next/navigation";
import { usePrivy, User } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";


export function Login() {
    const router = useRouter()
    
    const { ready, authenticated, user } = usePrivy()

    const { login } = useLogin({
        onComplete: ( wasAlreadyAuthenticated ) => {
            console.log(wasAlreadyAuthenticated)
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
                router.replace("/fleet");
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
        <Button disabled={!ready} onClick={Login} className="w-40 cursor-pointer z-20">
            <div className="flex w-full items-center justify-between">
              <p>GET STARTED</p>
              <LogIn/>
            </div>
        </Button>
    );
}