import { PrivyClient } from "@privy-io/server-auth";
import { cookies } from 'next/headers';

export async function getPrivyUser() {
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const privyAppSecret = process.env.PRIVY_APP_SECRET;
    
    const privy = new PrivyClient(
        privyAppId!,
        privyAppSecret!
    );

    const idToken = cookies().get("privy-id-token")?.value;
    console.log(idToken)

    if (!idToken) {
        console.log("No Privy ID token found");
        return null
    }
    
    const user = await privy.getUser({idToken: idToken})
    return user
}   