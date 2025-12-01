import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LocalStorageKeys } from "../lib/types";

const LandingPage = dynamic(() => import("../components/landing-page"), {
  ssr: true,
});

const MessageList = dynamic(() => import("../components/message-list"), {
  ssr: false,
});

export default function HomePage() {
  const [hasSeenLanding, setHasSeenLanding] = useLocalStorage<boolean>(
    LocalStorageKeys.HasSeenLandingPage,
    false
  );
  const [showMessages, setShowMessages] = React.useState(hasSeenLanding);

  // Check if user wants to see messages directly (from hash)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Check URL hash first
      if (window.location.hash === "#messages") {
        setShowMessages(true);
        setHasSeenLanding(true);
        return;
      }
      
      // If user has seen landing before, show messages
      if (hasSeenLanding) {
        setShowMessages(true);
      }
    }
  }, [hasSeenLanding, setHasSeenLanding]);

  const handleGetStarted = () => {
    setShowMessages(true);
    setHasSeenLanding(true);
    if (typeof window !== "undefined") {
      window.location.hash = "#messages";
      // Scroll to messages section
      setTimeout(() => {
        const messagesEl = document.getElementById("messages");
        if (messagesEl) {
          messagesEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <>
      <Head>
        <title>ZKWhisper - Anonymous messages from your coworkers</title>
        <meta
          name="description"
          content="ZKWhisper enables truly anonymous messaging within your organization, community, or POAP holders group. Your identity stays private while your voice is heard."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="home-page">
        {showMessages ? (
          <div id="messages">
            <MessageList showMessageForm />
          </div>
        ) : (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
      </div>
    </>
  );
}
