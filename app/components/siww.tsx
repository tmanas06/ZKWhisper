"use client";

import React from "react";

// Wallet icon SVG component
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
    {/* eslint-disable-next-line max-len */}
    <path 
      d="M17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14Z" 
      fill="currentColor"
    />
  </svg>
);

const SignWithWalletButton = (props: { onClick: () => void; isLoading: boolean; disabled: boolean }) => {
  return (
    <button 
      onClick={() => props.onClick()} 
      className="message-form-oauth-button message-form-wallet-button" 
      disabled={props.disabled}
      title="Connect Web3 Wallet"
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

