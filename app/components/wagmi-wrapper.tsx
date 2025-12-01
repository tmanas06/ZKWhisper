"use client";

import React from "react";

interface WagmiWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that conditionally provides wagmi context
 * Only wraps children with WagmiProvider if wagmi is installed
 */
const WagmiWrapper: React.FC<WagmiWrapperProps> = ({ children }) => {
  const [wagmiReady, setWagmiReady] = React.useState(false);
  const [WagmiProvider, setWagmiProvider] = React.useState<any>(null);
  const [QueryClientProvider, setQueryClientProvider] = React.useState<any>(null);
  const [queryClient, setQueryClient] = React.useState<any>(null);
  const [wagmiConfig, setWagmiConfig] = React.useState<any>(null);

  React.useEffect(() => {
    // Only try to load wagmi on client side
    if (typeof window !== "undefined") {
      try {
        // Dynamic require to avoid build-time errors
        const wagmi = require("wagmi");
        const reactQuery = require("@tanstack/react-query");
        const { getWagmiConfig } = require("../lib/wagmi-config");
        
        setWagmiProvider(() => wagmi.WagmiProvider);
        setQueryClientProvider(() => reactQuery.QueryClientProvider);
        setQueryClient(new reactQuery.QueryClient());
        setWagmiConfig(getWagmiConfig());
        setWagmiReady(true);
      } catch (e) {
        // wagmi not available - continue without it
        setWagmiReady(true); // Still mark as ready, just without wagmi
      }
    }
  }, []);

  // If wagmi is available, wrap with providers
  if (wagmiReady && WagmiProvider && QueryClientProvider && wagmiConfig && queryClient) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  // Fallback without wagmi - app still works with MetaMask via window.ethereum
  return <>{children}</>;
};

export default WagmiWrapper;
