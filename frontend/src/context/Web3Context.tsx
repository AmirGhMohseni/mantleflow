'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RainbowKitProvider,
  getDefaultConfig,
  midnightTheme,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, useAccount, useConnect } from 'wagmi'
import { mantleTestnet } from 'viem/chains'
import { http } from 'viem'

/* ---------------- wagmi config ---------------- */

const config = getDefaultConfig({
  appName: 'MantleFlow',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mantleTestnet],
  transports: {
    [mantleTestnet.id]: http(
      process.env.NEXT_PUBLIC_MANTLE_RPC_URL
    ),
  },
  ssr: false,
})

/* ---------------- shared stuff ---------------- */

const queryClient = new QueryClient()
const Web3Context = createContext<any>(null)

/* ---------------- internal state provider ---------------- */

function Web3StateProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        connect,
        connectors,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

/* ---------------- public provider (FIXED) ---------------- */

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🔑 این خط کل مشکل hydration رو حل می‌کنه
  if (!mounted) return null

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme({
            accentColor: '#4f46e5', // indigo-600
            accentColorForeground: 'white',
            borderRadius: 'large',
            overlayBlur: 'small',
          })}
          modalSize="compact"
          appInfo={{
            appName: 'MantleFlow',
          }}
        >
          <Web3StateProvider>{children}</Web3StateProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

/* ---------------- hook ---------------- */

export function useWeb3() {
  return useContext(Web3Context)
}
