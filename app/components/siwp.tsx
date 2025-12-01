"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const POAPSelectModal = dynamic(() => import("./poap-select-modal"), {
  ssr: false,
});

// POAP icon SVG component
const POAPIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path 
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
      fill="currentColor"
    />
    <circle 
      cx="12" 
      cy="12" 
      r="3" 
      fill="currentColor"
    />
  </svg>
);

const SignWithPOAPButton = (props: { 
  onClick: (eventId: string) => void; 
  isLoading: boolean; 
  disabled: boolean 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet first
  const handleClick = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet to use POAP authentication.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsModalOpen(true);
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        alert("Connection rejected. Please approve the connection request.");
      } else {
        alert(`Failed to connect: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelect = (eventId: string) => {
    props.onClick(eventId);
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleClick} 
        className="message-form-oauth-button message-form-poap-button" 
        disabled={props.disabled || isConnecting}
        title="Connect with POAP NFT (fetches from your wallet)"
      >
        {(props.isLoading || isConnecting) ? (
          <span className="spinner-icon" style={{ color: "white" }} />
        ) : (
          <POAPIcon />
        )}
      </button>
      {walletAddress && (
        <POAPSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelect}
          walletAddress={walletAddress}
        />
      )}
    </>
  );
};

export default SignWithPOAPButton;
