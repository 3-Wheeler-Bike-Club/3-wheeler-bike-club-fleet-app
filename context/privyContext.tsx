"use client";

import {PrivyProvider} from "@privy-io/react-auth";
import { celo } from "viem/chains";

export default function PrivyContext({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
        config={{
            // Create embedded wallets for users who don't have a wallet
            defaultChain: celo,
            supportedChains: [celo],
            embeddedWallets: {
                ethereum: {
                    createOnLogin: "users-without-wallets"
                }
            }
        }}
    >
      {children}
    </PrivyProvider>
  );
}