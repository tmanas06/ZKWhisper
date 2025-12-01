"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useLocalStorage } from "@uidotdev/usehooks";
import MessageList from "../../components/message-list";
import { WalletProvider } from "../../lib/providers/wallet";

// See messages from wallet users
export default function WalletPage() {
  const [currentGroupId] = useLocalStorage<string | null>(
    "currentGroupId",
    null
  );

  const walletAddress = useRouter().query.walletAddress as string;

  if (!walletAddress) {
    return null;
  }

  const anonGroup = WalletProvider.getAnonGroup(walletAddress);

  return (
    <>
      <Head>
        <title>Anonymous messages from {anonGroup.title} - ZKWhisper</title>
      </Head>

      <div className="domain-page">
        <div className="company-info">
          <div className="company-logo">
            <Image
              src={anonGroup.logoUrl}
              alt={anonGroup.title}
              width={80}
              height={80}
            />
          </div>
          <div>
            <div className="company-title">{anonGroup.title}</div>
            <div className="company-description">
              Anonymous messages from wallet users
            </div>
          </div>
        </div>

        <MessageList
          groupId={walletAddress.toLowerCase()}
          showMessageForm={
            currentGroupId?.toLowerCase() === walletAddress.toLowerCase()
          }
        />
      </div>
    </>
  );
}
