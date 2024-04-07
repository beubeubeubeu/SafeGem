'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
// Overrides charka-ui theme
import theme from '../theme/theme';
import {
  hardhat,
  sepolia
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

const config = getDefaultConfig({
  appName: 'SafeTickets',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia, hardhat] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <ChakraProvider theme={theme}>
          <RainbowKitProvider
            coolMode={true}
            theme={
              lightTheme({
                accentColor: 'teal',
                fontStack: 'system'
              })
            }
          >
            {children}
          </RainbowKitProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}