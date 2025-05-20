"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { celo } from "viem/chains";

export default function PrivyContext({children}: {children: ReactNode}) {
    return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          appearance: {
            accentColor: "#E2C837",
            logo: "https://i.ibb.co/1R7dngG/3-Wheeler-Logo-Horizontal-4x.png",
        },
        defaultChain: celo,
        supportedChains: [celo],
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: "users-without-wallets"
          }
        }}
      >
        {children}
      </PrivyProvider>
    );
  }