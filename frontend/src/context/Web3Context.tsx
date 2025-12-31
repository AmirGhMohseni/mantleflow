'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createConfig, http, WagmiProvider, useAccount, useConnect, useChainId } from 'wagmi';
import { mantleTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, connectorsForWallets, useRainbowKit } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';

// تنظیمات واقعی شبکه
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // جایگزین کن با project ID واقعی

const config = createConfig({
  chains: [mantleTestnet],
  transports: {
    [mantleTestnet.id]: http('https://rpc.testnet.mantle.xyz'),
  },
  connectors: connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet({ chains: [mantleTestnet] }),
        rainbowWallet({ projectId, chains: [mantleTestnet] }),
        metaMaskWallet({ projectId, chains: [mantleTestnet] }),
      ],
    },
  ]),
  ssr: true,
});

const queryClient = new QueryClient();

const Web3Context = createContext<any>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { openConnectModal } = useRainbowKit();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnect = async () => {
    if (openConnectModal) {
      openConnectModal();
    } else {
      // فولبک برای محیط‌های بدون RainbowKit
      try {
        await connect({ connector: connectors[0] });
      } catch (error) {
        console.error('Connection failed:', error);
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Context.Provider value={{ address, isConnected, handleConnect, connectors }}>
            {children}
          </Web3Context.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}