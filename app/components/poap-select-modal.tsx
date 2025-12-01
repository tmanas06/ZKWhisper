"use client";

import React, { useState, useEffect } from "react";
import IonIcon from "@reacticons/ionicons";

interface POAP {
  tokenId: string;
  eventId: string;
  eventName: string;
  eventDescription: string;
  eventImageUrl: string;
  created: string;
}

interface POAPSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (eventId: string) => void;
  walletAddress: string;
}

const POAPSelectModal: React.FC<POAPSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  walletAddress,
}) => {
  const [poaps, setPoaps] = useState<POAP[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && walletAddress) {
      fetchPOAPs();
    }
  }, [isOpen, walletAddress]);

  const fetchPOAPs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/poap/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Provide helpful error message for 403 (API key required)
        if (response.status === 403) {
          if (errorData.requiresApiKey) {
            throw new Error(
              "POAP API requires an API key. Please contact the administrator to set up POAP_API_KEY. " +
              "You can get an API key at https://app.poap.tech/"
            );
          } else {
            throw new Error(
              errorData.error || "POAP API access denied. The API key may be invalid or rate limited."
            );
          }
        }
        
        throw new Error(
          errorData.error || `Failed to fetch POAPs (Status: ${response.status})`
        );
      }

      const data = await response.json();
      const poapsList = data.poaps || [];
      setPoaps(poapsList);
      
      console.log("POAPs fetched:", poapsList.length, poapsList);
      
      if (poapsList.length === 0 && !data.error) {
        setError("No POAPs found in this wallet. You need to own at least one POAP to use this feature.");
      } else if (data.error) {
        setError(data.error + (data.details ? `: ${data.details}` : ""));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load POAPs");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="wallet-connect-modal-overlay" onClick={onClose}>
      <div 
        className="wallet-connect-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="wallet-connect-modal-header">
          <h2>Select a POAP</h2>
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
            Choose which POAP event you want to use for anonymous messaging
          </p>

          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <span className="spinner-icon" />
              <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
                Loading your POAPs...
              </p>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: "1rem", 
              background: "var(--error-bg, #fee)", 
              borderRadius: "var(--radius-md)",
              color: "var(--error-text, #c33)",
              marginBottom: "1rem"
            }}>
              {error}
            </div>
          )}

          {!loading && !error && poaps.length > 0 && (
            <div className="poap-list" style={{ 
              display: "grid", 
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))"
            }}>
              {poaps.map((poap) => (
                <button
                  key={poap.tokenId}
                  className="poap-card"
                  onClick={() => {
                    onSelect(poap.eventId);
                    onClose();
                  }}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "2px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all var(--transition-base)",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary-500)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {poap.eventImageUrl && (
                    <img
                      src={poap.eventImageUrl}
                      alt={poap.eventName}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        marginBottom: "0.5rem",
                      }}
                    />
                  )}
                  <h3 style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 600,
                    margin: 0,
                    color: "var(--text-primary)"
                  }}>
                    {poap.eventName}
                  </h3>
                  {poap.eventDescription && (
                    <p style={{ 
                      fontSize: "0.75rem", 
                      color: "var(--text-secondary)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {poap.eventDescription}
                    </p>
                  )}
                  <div style={{ 
                    fontSize: "0.7rem", 
                    color: "var(--text-tertiary)",
                    marginTop: "auto"
                  }}>
                    Event ID: {poap.eventId}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && poaps.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "2rem",
              color: "var(--text-secondary)"
            }}>
              <p>No POAPs found in this wallet.</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Visit <a href="https://poap.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-500)" }}>poap.xyz</a> to claim POAPs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POAPSelectModal;

