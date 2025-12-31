import '../globals.css';
import { Web3Provider } from '@/context/Web3Context';

export const metadata = {
  title: 'MantleFlow - Tokenize Your Business Cash Flows',
  description: 'AI-powered cash flow prediction and tokenization on Mantle Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
