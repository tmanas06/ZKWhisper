"use client";

import React from "react";
import IonIcon from "@reacticons/ionicons";

interface LandingPageProps {
  onGetStarted?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else if (typeof window !== "undefined") {
      window.location.hash = "#messages";
      window.location.reload();
    }
  };
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <IonIcon name="shield-checkmark-outline" />
            <span>Zero-Knowledge Anonymous Messaging</span>
          </div>
          <h1 className="landing-hero-title">
            Speak Freely, Stay
            <span className="landing-hero-gradient"> Anonymous</span>
          </h1>
          <p className="landing-hero-description">
            ZKWhisper enables truly anonymous messaging within your organization, 
            community, or POAP holders group. Your identity stays private while 
            your voice is heard.
          </p>
          <div className="landing-hero-cta">
            <button 
              className="landing-cta-primary"
              onClick={handleGetStarted}
            >
              Get Started
              <IonIcon name="arrow-forward-outline" />
            </button>
            <a 
              href="https://github.com/tmanas06/zkwhisper" 
              target="_blank"
              rel="noopener noreferrer"
              className="landing-cta-secondary"
            >
              <IonIcon name="logo-github" />
              View on GitHub
            </a>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-hero-card">
            <div className="landing-hero-card-header">
              <div className="landing-hero-card-avatar"></div>
              <div>
                <div className="landing-hero-card-name">Someone from your org</div>
                <div className="landing-hero-card-time">Just now</div>
              </div>
            </div>
            <div className="landing-hero-card-message">
              "This platform lets us share honest feedback without fear..."
            </div>
            <div className="landing-hero-card-footer">
              <IonIcon name="heart-outline" />
              <span>12</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Why ZKWhisper?</h2>
          <p className="landing-section-subtitle">
            Built with privacy and anonymity at its core
          </p>
        </div>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="lock-closed-outline" />
            </div>
            <h3 className="landing-feature-title">Zero-Knowledge Proofs</h3>
            <p className="landing-feature-description">
              Cryptographic proofs verify your membership without revealing your identity. 
              Built with Noir ZK circuits.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="people-outline" />
            </div>
            <h3 className="landing-feature-title">Multiple Auth Methods</h3>
            <p className="landing-feature-description">
              Connect via Google OAuth, Web3 wallets, or POAP NFTs. 
              Choose the method that works for your community.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="shield-checkmark-outline" />
            </div>
            <h3 className="landing-feature-title">True Anonymity</h3>
            <p className="landing-feature-description">
              Your messages are cryptographically signed but your identity remains 
              completely private. No tracking, no linking.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="globe-outline" />
            </div>
            <h3 className="landing-feature-title">Group-Based Messaging</h3>
            <p className="landing-feature-description">
              Create exclusive groups for your company, community, or POAP event. 
              Only verified members can participate.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="code-slash-outline" />
            </div>
            <h3 className="landing-feature-title">Open Source</h3>
            <p className="landing-feature-description">
              Fully open source and auditable. Built with transparency in mind. 
              Contribute and help improve privacy for everyone.
            </p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">
              <IonIcon name="flash-outline" />
            </div>
            <h3 className="landing-feature-title">Fast & Modern</h3>
            <p className="landing-feature-description">
              Built with Next.js and modern web technologies. 
              Fast, responsive, and works on all devices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-how-it-works">
        <div className="landing-section-header">
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-subtitle">
            Simple, secure, and anonymous in three steps
          </p>
        </div>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step-number">1</div>
            <div className="landing-step-content">
              <h3 className="landing-step-title">Connect & Verify</h3>
              <p className="landing-step-description">
                Sign in with Google, connect your Web3 wallet, or verify your POAP NFT. 
                We generate a cryptographic proof of your membership without revealing who you are.
              </p>
            </div>
          </div>
          <div className="landing-step">
            <div className="landing-step-number">2</div>
            <div className="landing-step-content">
              <h3 className="landing-step-title">Post Anonymously</h3>
              <p className="landing-step-description">
                Share your thoughts, feedback, or questions. Your messages are 
                cryptographically signed but your identity stays completely private.
              </p>
            </div>
          </div>
          <div className="landing-step">
            <div className="landing-step-number">3</div>
            <div className="landing-step-content">
              <h3 className="landing-step-title">Engage Safely</h3>
              <p className="landing-step-description">
                Like, reply, and interact with messages from your group. 
                All while maintaining complete anonymity and privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="landing-use-cases">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Perfect For</h2>
          <p className="landing-section-subtitle">
            Various communities and use cases
          </p>
        </div>
        <div className="landing-use-cases-grid">
          <div className="landing-use-case-card">
            <IonIcon name="business-outline" />
            <h3>Company Feedback</h3>
            <p>Anonymous employee feedback and suggestions</p>
          </div>
          <div className="landing-use-case-card">
            <IonIcon name="people-circle-outline" />
            <h3>Community Forums</h3>
            <p>Open discussions within your community</p>
          </div>
          <div className="landing-use-case-card">
            <IonIcon name="ticket-outline" />
            <h3>POAP Holders</h3>
            <p>Exclusive messaging for NFT event attendees</p>
          </div>
          <div className="landing-use-case-card">
            <IonIcon name="school-outline" />
            <h3>Educational Institutions</h3>
            <p>Safe space for students to share thoughts</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <div className="landing-cta-content">
          <h2 className="landing-cta-title">Ready to Speak Freely?</h2>
          <p className="landing-cta-description">
            Join ZKWhisper and start having honest, anonymous conversations 
            with your community today.
          </p>
          <button 
            className="landing-cta-primary landing-cta-large"
            onClick={handleGetStarted}
          >
            Get Started Now
            <IonIcon name="arrow-forward-outline" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

