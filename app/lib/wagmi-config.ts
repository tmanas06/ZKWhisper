// Wagmi configuration factory
// This function will only create config if wagmi is installed
export function createWagmiConfig() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createConfig } = require("wagmi");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { mainnet, sepolia, polygon, arbitrum, optimism } = 
      require("wagmi/chains");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { injected, walletConnect } = require("wagmi/connectors");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { publicProvider } = require("wagmi/providers/public");

    // Get WalletConnect Project ID from environment or use a default
    const walletConnectProjectId = 
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 
      "default-project-id";

    // Configure supported chains
    const chains = [mainnet, sepolia, polygon, arbitrum, optimism] as const;

    return createConfig({
      chains,
      connectors: [
        injected({
          shimDisconnect: true,
        }),
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
        }),
      ],
      provider: publicProvider(),
    });
  } catch (e) {
    // wagmi not available - return null
    return null;
  }
}

// Export a getter that creates config on demand
export function getWagmiConfig() {
  return createWagmiConfig();
}
