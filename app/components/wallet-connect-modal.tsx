"use client";

import React, { useState } from "react";
import IonIcon from "@reacticons/ionicons";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectMetaMask = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setConnectingTo("metamask");
    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        onConnect(accounts[0]);
        onClose();
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        alert("Connection rejected. Please approve the connection request.");
      } else {
        alert(`Failed to connect: ${err.message || "Unknown error"}`);
      }
    } finally {
      setConnectingTo(null);
    }
  };

  const hasMetaMask = typeof window !== "undefined" && 
    (window.ethereum?.isMetaMask || window.ethereum);

  return (
    <div className="wallet-connect-modal-overlay" onClick={onClose}>
      <div 
        className="wallet-connect-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wallet-connect-modal-header">
          <h2>Connect Wallet</h2>
          <button 
            className="wallet-connect-modal-close" 
            onClick={onClose}
            aria-label="Close"
          >
            <IonIcon name="close-outline" />
          </button>
        </div>

        <div className="wallet-connect-modal-content">
          <p className="wallet-connect-modal-description">
            Choose a wallet to connect to ZKWhisper
          </p>

          <div className="wallet-connect-options">
            {hasMetaMask && (
              <button
                className="wallet-connect-option"
                onClick={handleConnectMetaMask}
                disabled={connectingTo === "metamask"}
              >
                <div className="wallet-connect-option-icon">
                  <MetaMaskIcon />
                </div>
                <div className="wallet-connect-option-info">
                  <div className="wallet-connect-option-name">MetaMask</div>
                  <div className="wallet-connect-option-description">
                    Connect using MetaMask browser extension
                  </div>
                </div>
                {connectingTo === "metamask" && (
                  <div className="wallet-connect-option-loading">
                    <span className="spinner-icon small" />
                  </div>
                )}
              </button>
            )}

            {/* WalletConnect will be available when wagmi is properly installed */}
            <WalletConnectButton
              onConnect={onConnect}
              onClose={onClose}
              connectingTo={connectingTo}
              setConnectingTo={setConnectingTo}
            />
          </div>

          {!hasMetaMask && (
            <div className="wallet-connect-no-wallets">
              <p>No wallets detected. Please install MetaMask.</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="wallet-connect-install-link"
              >
                Install MetaMask
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate component that uses wagmi hooks (only renders if wagmi is available)
const WalletConnectButton: React.FC<{
  onConnect: (address: string) => void;
  onClose: () => void;
  connectingTo: string | null;
  setConnectingTo: (id: string | null) => void;
}> = ({ onConnect, onClose, connectingTo, setConnectingTo }) => {
  // Try to use wagmi hooks - this will only work if wagmi is installed
  let connectHook: any = null;
  let accountHook: any = null;

  if (typeof window !== "undefined") {
    try {
      const wagmi = require("wagmi");
      // Create wrapper components that use hooks
      const WrappedComponent = () => {
        connectHook = wagmi.useConnect();
        accountHook = wagmi.useAccount();
        return null;
      };
      // For now, return null - wagmi integration will be added when packages are installed
      return null;
    } catch {
      // wagmi not available
      return null;
    }
  }

  return null;
};

const MetaMaskIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M29.4545 2L18.1818 13.2727L20.3636 15.4545L29.4545 6.36364V2Z"
      fill="#E2761B"
    />
    <path
      d="M2 2L13.2727 13.2727L11.0909 15.4545L2 6.36364V2Z"
      fill="#E4761B"
    />
    <path
      d="M25.4545 22.5455L22.5455 27.6364L29.4545 30L31.6364 22.5455L25.4545 22.5455Z"
      fill="#E4761B"
    />
    <path
      d="M0.363636 22.5455L2.54545 30L9.45455 27.6364L6.54545 22.5455L0.363636 22.5455Z"
      fill="#E4761B"
    />
    <path
      d="M8.72727 14.1818L6.54545 17.0909L13.2727 17.4545L12.7273 9.81818L8.72727 14.1818Z"
      fill="#E4761B"
    />
    <path
      d="M23.2727 14.1818L19.2727 9.72727L18.7273 17.4545L25.4545 17.0909L23.2727 14.1818Z"
      fill="#E4761B"
    />
    <path
      d="M9.45455 27.6364L13.8182 25.8182L10.1818 22.5455L9.45455 27.6364Z"
      fill="#D7C1B3"
    />
    <path
      d="M18.1818 25.8182L22.5455 27.6364L21.8182 22.5455L18.1818 25.8182Z"
      fill="#D7C1B3"
    />
    <path
      d="M22.5455 17.0909L18.7273 17.4545L19.2727 20.3636L19.6364 22.1818L22.5455 17.0909Z"
      fill="#233447"
    />
    <path
      d="M9.45455 17.0909L12.3636 22.1818L12.7273 20.3636L13.2727 17.4545L9.45455 17.0909Z"
      fill="#233447"
    />
    <path
      d="M6.54545 22.5455L10.1818 22.1818L9.81818 24.3636L9.45455 27.6364L6.54545 22.5455Z"
      fill="#CD6116"
    />
    <path
      d="M21.8182 22.1818L25.4545 22.5455L22.5455 27.6364L22.1818 24.3636L21.8182 22.1818Z"
      fill="#CD6116"
    />
    <path
      d="M25.4545 17.0909L22.5455 22.5455L23.2727 23.2727L29.4545 24L25.4545 17.0909Z"
      fill="#E4751F"
    />
    <path
      d="M2.54545 24L8.72727 23.2727L9.45455 22.5455L6.54545 17.0909L2.54545 24Z"
      fill="#E4751F"
    />
    <path
      d="M13.2727 17.4545L12.7273 20.3636L13.6364 20.7273L18.3636 20.7273L19.2727 20.3636L18.7273 17.4545L13.2727 17.4545Z"
      fill="#F6851B"
    />
    <path
      d="M2 6.36364L6.54545 17.0909L8.72727 14.1818L2 6.36364Z"
      fill="#763D16"
    />
    <path
      d="M29.4545 6.36364L22.7273 14.1818L25.4545 17.0909L30 6.36364L29.4545 6.36364Z"
      fill="#763D16"
    />
    <path
      d="M25.4545 17.0909L22.5455 22.5455L23.2727 17.4545L25.4545 17.0909Z"
      fill="#F6851B"
    />
    <path
      d="M6.54545 17.0909L8.72727 17.4545L9.45455 22.5455L6.54545 17.0909Z"
      fill="#F6851B"
    />
  </svg>
);

const WalletIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 10H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default WalletConnectModal;
