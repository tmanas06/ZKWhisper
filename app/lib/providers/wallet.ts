import { AnonGroupProvider, EphemeralKey } from "../types";

/**
 * Wallet AnonGroupProvider for Web3 wallet users
 * Uses wallet signatures to prove ownership
 */
export const WalletProvider: AnonGroupProvider = {
  name: () => "wallet",
  
  getSlug: () => "wallet",
  
  generateProof: async (ephemeralKey: EphemeralKey) => {
    // Check if wallet is available
    if (typeof window === "undefined" || !window.ethereum) {
      const errorMsg = "No Web3 wallet detected. Please install MetaMask " +
        "or another compatible wallet (like Coinbase Wallet, " +
        "WalletConnect, etc.).";
      throw new Error(errorMsg);
    }

    const ethereum = window.ethereum;
    
    // Request account access
    let accounts: string[];
    try {
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        throw new Error("Wallet connection was rejected. " +
          "Please approve the connection request.");
      }
      throw new Error(`Failed to connect wallet: ${err.message || "Unknown error"}`);
    }
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No wallet accounts found. Please unlock your wallet and try again.");
    }

    const walletAddress = accounts[0];
    
    // Create a message to sign (using ephemeral pubkey hash as nonce)
    const keyHash = ephemeralKey.ephemeralPubkeyHash.toString();
    const message = `ZKWhisper Authentication\n\nEphemeral Key Hash: ${keyHash}\n\n` +
      `This signature proves you own this wallet address and allows you ` +
      `to post anonymous messages.`;
    
    // Request signature
    let signature: string;
    try {
      signature = await ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        throw new Error("Signature request was rejected. " +
          "Please sign the message to continue.");
      }
      throw new Error(`Failed to get signature: ${err.message || "Unknown error"}`);
    }

    // For wallet provider, we use a simplified proof system
    // The signature itself serves as proof of wallet ownership
    // In a production system, you'd want to use a ZK circuit here
    
    const anonGroup = WalletProvider.getAnonGroup(walletAddress);
    
    const proofArgs = {
      signature,
      message,
      walletAddress,
    };

    // Create a simple proof from the signature (in production, use ZK circuit)
    const proof = new TextEncoder().encode(JSON.stringify({
      signature,
      walletAddress,
      ephemeralPubkeyHash: ephemeralKey.ephemeralPubkeyHash.toString(),
    }));

    return {
      proof: new Uint8Array(proof),
      anonGroup,
      proofArgs,
    };
  },
  
  verifyProof: async (
    proof: Uint8Array,
    anonGroupId: string,
    ephemeralPubkey: bigint,
    ephemeralPubkeyExpiry: Date,
    proofArgs: { signature: string; message: string; walletAddress: string }
  ) => {
    // Verify the wallet address matches
    if (proofArgs.walletAddress.toLowerCase() !== anonGroupId.toLowerCase()) {
      return false;
    }

    // In a production system, you'd verify the signature here
    // For now, we'll do a basic check
    try {
      const proofData = JSON.parse(new TextDecoder().decode(proof));
      return proofData.walletAddress?.toLowerCase() === anonGroupId.toLowerCase();
    } catch {
      return false;
    }
  },
  
  getAnonGroup: (walletAddress: string) => {
    // Use first 6 and last 4 characters of address for display
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    return {
      id: walletAddress.toLowerCase(),
      title: `Wallet ${shortAddress}`,
      logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${walletAddress}`,
    };
  },
};

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { 
        method: string; 
        params?: unknown[] 
      }) => Promise<unknown>;
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      selectedAddress?: string;
    };
  }
}

