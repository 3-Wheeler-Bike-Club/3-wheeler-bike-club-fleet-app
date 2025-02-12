import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { PrivyContext } from "@/providers/PrivyContext";

import { config } from "@/utils/config";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { WagmiContext } from "@/providers/WagmiContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "3 Wheeler Bike Club | Ownership, Community & Governance",
  description: "P2P Financing Platform for the 3 Wheeler Bike Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState( 
    config, 
    headers().get("cookie") 
  ) 

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiContext initialState={initialState!}>
          <PrivyContext>
                {children}
          </PrivyContext>
        </WagmiContext>
      </body>
    </html>
  );
}
