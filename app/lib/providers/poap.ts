import { AnonGroupProvider, EphemeralKey } from "../types";

/**
 * POAP AnonGroupProvider for NFT holders
 * Uses POAP API to verify NFT ownership
 * Now automatically fetches POAPs from wallet address
 */
export const POAPProvider: AnonGroupProvider = {
  name: () => "poap",
  
  getSlug: () => "poap",
  
  generateProof: async (
    ephemeralKey: EphemeralKey, 
    walletAddress?: string,
    selectedEventId?: string
  ) => {
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
      accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[];
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

    const address = walletAddress || accounts[0];
    
    // If no event ID is provided, we need to fetch POAPs and let user select
    // This will be handled by the UI component before calling generateProof
    if (!selectedEventId) {
      throw new Error("Please select a POAP event to use. The selection modal should have been shown.");
    }
    
    // Verify POAP ownership via API
    try {
      const response = await fetch("/api/poap/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address.toLowerCase(),
          poapEventId: selectedEventId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          "Failed to verify POAP ownership. Make sure you hold the selected POAP NFT."
        );
      }

      const data = await response.json();
      
      if (!data.hasPOAP) {
        throw new Error(
          `You don't hold POAP event #${selectedEventId}. ` +
          "Please select a POAP you own."
        );
      }

      // Create a message to sign (using ephemeral pubkey hash as nonce)
      const keyHash = ephemeralKey.ephemeralPubkeyHash.toString();
      const message = `ZKWhisper POAP Authentication\n\nEphemeral Key Hash: ${keyHash}\n\n` +
        `Event: ${data.eventName || `POAP #${selectedEventId}`}\n\n` +
        `This signature proves you own this wallet address and hold the required POAP NFT.`;
      
      // Request signature
      let signature: string;
      try {
        signature = await ethereum.request({
          method: "personal_sign",
          params: [message, address],
        }) as string;
      } catch (error: unknown) {
        const err = error as { code?: number; message?: string };
        if (err.code === 4001) {
          throw new Error("Signature request was rejected. " +
            "Please sign the message to continue.");
        }
        throw new Error(`Failed to get signature: ${err.message || "Unknown error"}`);
      }

      const anonGroup = POAPProvider.getAnonGroup(
        data.poapEventId || selectedEventId
      );
      
      const proofArgs = {
        signature,
        message,
        walletAddress: address,
        poapEventId: data.poapEventId || selectedEventId,
        poapTokenId: data.poapTokenId,
        eventName: data.eventName,
      };

      // Create a simple proof from the signature
      const proof = new TextEncoder().encode(JSON.stringify({
        signature,
        walletAddress: address,
        poapEventId: data.poapEventId || selectedEventId,
        ephemeralPubkeyHash: ephemeralKey.ephemeralPubkeyHash.toString(),
      }));

      return {
        proof: new Uint8Array(proof),
        anonGroup,
        proofArgs,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to verify POAP ownership");
    }
  },
  
  verifyProof: async (
    proof: Uint8Array,
    anonGroupId: string,
    ephemeralPubkey: bigint,
    ephemeralPubkeyExpiry: Date,
    proofArgs: { 
      signature: string; 
      message: string; 
      walletAddress: string;
      poapEventId?: string;
      poapTokenId?: string;
      eventName?: string;
    }
  ) => {
    // Verify the wallet address matches
    const expectedGroupId = `poap-${proofArgs.poapEventId || "default"}`;
    if (anonGroupId !== expectedGroupId) {
      return false;
    }

    // Basic verification - server will verify POAP ownership when message is posted
    try {
      const proofData = JSON.parse(new TextDecoder().decode(proof));
      return proofData.walletAddress?.toLowerCase() === 
        proofArgs.walletAddress.toLowerCase() &&
        proofData.poapEventId === proofArgs.poapEventId;
    } catch {
      return false;
    }
  },
  
  getAnonGroup: (poapEventId: string, eventName?: string) => {
    return {
      id: `poap-${poapEventId}`,
      title: eventName || `POAP Event #${poapEventId}`,
      logoUrl: "https://assets.poap.xyz/poap-badge-logo-2024.png",
    };
  },
};
