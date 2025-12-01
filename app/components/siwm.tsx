"use client";

import React from "react";

// Fallback wallet icon if SVG doesn't exist
const WalletIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* eslint-disable-next-line max-len */}
    <path 
      d="M21 4H3C1.89543" 
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
