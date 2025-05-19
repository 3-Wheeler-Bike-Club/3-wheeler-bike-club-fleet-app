import { injected } from "wagmi/connectors";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { celo, optimism } from "wagmi/chains";

export const config = createConfig({
    connectors: [injected()],
    chains: [celo, optimism],
    ssr: true,
    transports: {
      [celo.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
      [optimism.id]: http(),
    },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}