import { GoogleOAuthProvider } from "./google-oauth";
import { AnonGroupProvider } from "../types";
import { MicrosoftOAuthProvider } from "./microsoft-oauth";
import { WalletProvider } from "./wallet";
import { POAPProvider } from "./poap";
// import { SlackOAuthProvider } from "./slack-oauth";

export const Providers: Record<string, AnonGroupProvider> = {
  "google-oauth": GoogleOAuthProvider,
  "microsoft-oauth": MicrosoftOAuthProvider,
  "wallet": WalletProvider,
  "poap": POAPProvider,
  // "slack-oauth": SlackOAuthProvider,
};

export const ProviderSlugKeyMap: Record<string, AnonGroupProvider> = {
  domain: GoogleOAuthProvider,
  wallet: WalletProvider,
  poap: POAPProvider,
};
