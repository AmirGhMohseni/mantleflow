import '@rainbow-me/rainbowkit/styles.css'
import '../globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Web3Provider } from '@/context/Web3Context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MantleFlow - Tokenize Your Business Cash Flows',
  description: 'AI-powered cash flow prediction and tokenization on Mantle Network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Web3Provider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  )
}
