"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@uidotdev/usehooks";
import IonIcon from "@reacticons/ionicons";
import { LocalStorageKeys } from "../lib/types";
import { Providers } from "../lib/providers";
import { WelcomeModal } from './welcome-modal';
import logo from "@/assets/logo.png";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useLocalStorage<boolean>(
    LocalStorageKeys.DarkMode,
    false
  );
  const [currentGroupId] = useLocalStorage<string | null>(
    LocalStorageKeys.CurrentGroupId,
    null
  );
  const [currentProvider] = useLocalStorage<string | null>(
    LocalStorageKeys.CurrentProvider,
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [consoleShown, setConsoleShown] = React.useState(false);

  let slug = null;
  let walletAddress = null;
  if (currentProvider && currentGroupId) {
    const provider = Providers[currentProvider];
    slug = provider.getSlug();
    // If wallet provider, store the address for navigation
    if (currentProvider === "wallet") {
      walletAddress = currentGroupId;
    }
  }

  // Set dark mode with proper CSS variables
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);

  React.useEffect(() => {
    if (consoleShown) {
      return;
    }

    console.log(
      '%c📝 If you run in to any errors, please create an issue at https://github.com/tmanas06/zkwhisper/issues\n' +
      '🐦 You can also reach out to me on Twitter at https://twitter.com/_saleel',
      'background: #efefef; color: black; font-size: 16px; padding: 10px; border-radius: 3px;'
    );
    setConsoleShown(true);
  }, [consoleShown]);

  return (
    <>
      <div className="page">
        <div className="mobile-header">
          <button
            className={`sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <IonIcon name={isSidebarOpen ? "close" : "menu"} />
          </button>
          <div
            className="mobile-header-logo"
            style={isSidebarOpen ? { display: "none" } : {}}
          >
            <Link href="/">ZKWhisper</Link>
          </div>
        </div>
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="logo">
            <Link href="/">
              <Image src={logo} alt="ZKWhisper" width={150} height={50} />
            </Link>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-nav-header">
              <Link
                onClick={() => setIsSidebarOpen(false)}
                href="/"
                className="sidebar-nav-item"
              >
                Home
              </Link>

              {slug && currentProvider === "wallet" && walletAddress && (
                <Link
                  onClick={() => setIsSidebarOpen(false)}
                  href={`/wallet/${walletAddress}`}
                  className="sidebar-nav-item"
                >
                  Wallet Chat
                </Link>
              )}
              {slug && currentProvider !== "wallet" && (
                <Link
                  onClick={() => setIsSidebarOpen(false)}
                  href={`/${slug}/${currentGroupId}/internal`}
                  className="sidebar-nav-item"
                >
                  {currentGroupId} Internal
                </Link>
              )}
            </div>

            <div className="sidebar-nav-actions">
              <button
                onClick={() => {
                  setIsDark(!isDark);
                  setIsSidebarOpen(false);
                }}
                className="sidebar-theme-toggle"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle dark mode"
              >
                <IonIcon name={isDark ? "sunny" : "moon"} />
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </nav>

          <p className="sidebar-nav-copyright">
            <span>Made with </span>
            <Link 
              href="https://noir-lang.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#382E81' }}
            >
              Noir
            </Link>
            <span> ❤️ </span>
          </p>
          <div className="sidebar-nav-footer-links">
            <Link
              href="/disclaimer"
            >
              Disclaimer
            </Link>
            <Link
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </aside>
        <main className="container">
          <div className="content">{children}</div>
        </main>
      </div>

      <WelcomeModal />
    </>
  );
};

const LayoutClient = dynamic(() => Promise.resolve(Layout), {
  ssr: false,
});

export default LayoutClient;
