"use client"


import { PrivyProvider } from "@privy-io/react-auth"
import type { ReactNode } from "react"
import { base, celo, celoAlfajores } from "viem/chains"
import {SmartWalletsProvider} from '@privy-io/react-auth/smart-wallets'


type Props = {
    children: ReactNode,
}

export function PrivyContext ({ children }: Props) {

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
            config={{
                /* Replace this with your desired login methods */
                loginMethods: ["email"],
                /* Replace this with your desired appearance configuration */
                appearance: {
                    theme: "dark",
                    accentColor: "#E2C837",
                    logo: "https://i.ibb.co/1R7dngG/3-Wheeler-Logo-Horizontal-4x.png",
                },
                defaultChain: celo,
                supportedChains: [celo],
                embeddedWallets: {
                    createOnLogin: "all-users",
                    noPromptOnSignature: true
                },
            }}
        >
                {children}
        </PrivyProvider>
    )
}
