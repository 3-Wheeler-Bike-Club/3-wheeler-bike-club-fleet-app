"use server"

import { PrivyClient } from "@privy-io/server-auth";

export interface privyUserMetadataProps {
    firstname: string
    lastname: string
    country: string
    
}

export async function setCustomPrivyMetadata(did: string, privyUserMetadata: privyUserMetadataProps) {

    try {
        const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
        const privyAppSecret = process.env.PRIVY_APP_SECRET;

        const privy = new PrivyClient(
            privyAppId,
            privyAppSecret
        );

        // TypeScript will throw a type error if customMetadata is not of type {key1: string}
        const user = await privy.setCustomMetadata<{
            firstname: string
            lastname: string
            country: string
            
        }>(did, privyUserMetadata);
        
        console.log(user);
        return user;

    } catch (error) {
        console.error(error);
    }

}