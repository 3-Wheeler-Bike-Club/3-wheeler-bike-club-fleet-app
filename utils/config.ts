import { createConfig, http, cookieStorage, createStorage } from "wagmi"
import { celo } from "wagmi/chains"

//export const chains=
export const config = createConfig({
  chains: [ celo ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [celo.id]: http(),
  },
})

