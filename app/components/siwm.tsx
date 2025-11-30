"use client";

import React from "react";
import Image from "next/image";
import walletIcon from "@/assets/wallet-icon.svg";

// Fallback wallet icon if SVG doesn't exist
const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SignWithWalletButton = (props: { onClick: () => void; isLoading: boolean; disabled: boolean }) => {
  return (
    <button 
      onClick={() => props.onClick()} 
      className="message-form-oauth-button message-form-wallet-button" 
      disabled={props.disabled}
      title="Connect Wallet"
    >
      {props.isLoading ? (
        <span className="spinner-icon" style={{ color: "black" }} />
      ) : (
        <WalletIcon />
      )}
    </button>
  );
};

export default SignWithWalletButton;
