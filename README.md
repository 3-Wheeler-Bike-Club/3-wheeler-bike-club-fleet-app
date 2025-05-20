# 3WB Fleet App

A client-facing Next.js 14 TypeScript application that interfaces with the FleetOrderBook and FleetOrderToken contracts, allowing users to browse, purchase, and manage three-wheeler fleet investments.

## 🚀 Key Features

- **Wallet Integration**: Connect a Celo-compatible wallet (e.g., MetaMask, Valora) using Wagmi and Viem.
- **Fleet Marketplace**: View available fleets, including metadata and current fraction availability.
- **Fractional & Full Purchase**: Buy partial (1–50 fractions) or full (all 50 fractions) stakes in a fleet directly in the UI.
- **Order History**: Inspect past orders and current token balances fetched via ERC-6909 `getFleetOwned` calls.
- **On-Chain Status Tracking**: Display lifecycle status (Initialized → Created → Shipped → … → Transferred) for each order.
- **Token Management**: View and manage ERC-6909 tokens; custom transfer UI for reassigning stakes.
- **Responsive Layout**: Uses Tailwind CSS, Radix UI, and Shadcn for mobile-first design.
- **Animations & Carousels**: Embla Carousel for fleet slides and Framer Motion for smooth transitions.
- **State Management**: React Query for data fetching and caching.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)  
- **Language**: TypeScript, React 18  
- **UI**: Tailwind CSS, Radix UI, Shadcn UI, Lucide Icons  
- **Data Fetching**: React Query, Zod for schema validation  
- **Blockchain**: Wagmi & Viem for contract interaction  
- **Contracts**: FleetOrderBook, FleetOrderToken  
- **Utilities**: Custom hooks in `hooks/`, helpers in `lib/`  
- **Providers**: Auth, QueryClient, Wagmi setup in `providers/`
- **Backend**: Next.js API routes for any auxiliary server logic  

## 📦 Getting Started

### Prerequisites

- Node.js v18+ and npm or yarn
- A Celo RPC endpoint URL (e.g., Forno)
- Deployed `FleetOrderBook` & `FleetOrderToken` contract addresses

### Installation

```bash
git clone https://github.com/3-Wheeler-Bike-Club/3-wheeler-bike-club-fleet-app.git
cd 3-wheeler-bike-club-fleet-app
npm install
# or yarn install
```

### Configuration

Create a `.env.local` in project root with:

```env
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_FLEET_ORDER_BOOK_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_FLEET_ORDER_TOKEN_ADDRESS=0xYourTokenAddress
# Optional: specify accepted ERC20 stablecoin addresses
NEXT_PUBLIC_ACCEPTED_ERC20S=["0x…", "0x…"]
```

### Development

```bash
npm run dev
# or yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```bash
/
├── app/                   # Next.js App Router pages & API routes
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks (useFleet, useOrder)
├── lib/                   # Blockchain & util helpers
├── context/             # React context & Wagmi provider setup
├── public/                # Static assets (images, icons)
├── utils/                 # Generic utilities and constants
├── environment.d.ts       # Env var TypeScript definitions
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
└── package.json           # Dependencies & scripts
```

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository and create a branch (`git checkout -b feature/xyz`).
2. Commit your changes with clear messages.
3. Open a Pull Request and describe your feature or fix.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
```