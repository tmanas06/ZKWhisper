import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Message, SignedMessageWithProof } from "../../lib/types";
import { fetchMessages } from "../../lib/api";
import MessageList from "../../components/message-list";
import MessageForm from "../../components/message-form";
import Layout from "../../components/layout";

const POAPPage: React.FC = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [messages, setMessages] = useState<SignedMessageWithProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const fetchedMessages = await fetchMessages({
          groupId: `poap-${eventId}`,
          provider: "poap",
          limit: 50,
        });
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
    
    // Refresh messages every 30 seconds
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, [eventId]);

  const handleNewMessage = (message: SignedMessageWithProof) => {
    setMessages((prev) => [message, ...prev]);
  };

  if (!eventId) {
    return (
      <Layout>
        <div className="content">
          <h1>POAP Event ID required</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="content">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: 700, 
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            POAP Holders Chat
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Exclusive anonymous messaging for POAP NFT holders
          </p>
        </div>

        <MessageForm isInternal={false} onSubmit={handleNewMessage} />

        {isLoading ? (
          <div style={{ 
            padding: "2rem", 
            textAlign: "center",
            color: "var(--text-secondary)"
          }}>
            Loading messages...
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
    </Layout>
  );
};

export default POAPPage;

