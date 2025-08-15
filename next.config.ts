import type { NextConfig } from "next";

const NextConfigDevelopment: NextConfig = {}

const NextConfigProduction: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://privy.finance.3wb.club; frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://privy.finance.3wb.club; connect-src 'self' https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://privy.finance.3wb.club; worker-src 'self'; manifest-src 'self'",
          },
        ],
      },
    ];  
  },
};

export default process.env.NODE_ENV === "production" ? NextConfigProduction : NextConfigDevelopment;
