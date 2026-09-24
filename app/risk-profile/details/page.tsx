"use client";

import { useEffect, useState } from "react";

type RiskProfile = {
  name: string;
  tag: string;
  thought: string;
  timeScore: number;
  riskScore: number;
  combinedScore: number;
};

const descriptions: Record<string, string> = {
  Conservative: "Focus on capital preservation and lower risk tolerance.",
  "Moderately Conservative": "Income with low growth and lower volatility.",
  Balanced: "Balance of growth and income with moderate risk.",
  Growth: "Strong long-term growth with higher volatility.",
  Aggressive: "Maximum long-term growth with high volatility tolerance."
};

export default function RiskProfileDetails() {
  const [profile, setProfile] = useState<RiskProfile | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("riskProfile");
      if (saved) setProfile(JSON.parse(saved));
    } catch {}
  }, []);

  if (!profile) {
    return (
      <main className="risk-page">
        <div className="risk-phone">
          <section className="risk-result">
            <div className="risk-eyebrow">INVESTOR RISK PROFILE</div>
            <h1>Profile not available</h1>
            <p className="result-description">Complete the questionnaire to see your investor risk profile.</p>
            <button className="risk-continue" onClick={() => { window.location.href = "/risk-profile"; }}>Start assessment</button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="risk-page">
      <div className="risk-label">SCREENROOT · RISK PROFILE</div>
      <div className="risk-phone">
        <header className="risk-header">
          <button className="risk-back" onClick={() => { window.location.href = "/prototype-1"; }}>←</button>
          <div className="risk-progress"><strong style={{fontSize:"11px"}}>Your investor profile</strong></div>
          <span />
        </header>

        <section className="risk-result">
          <div className="result-icon">✓</div>
          <div className="risk-eyebrow">YOUR INVESTOR RISK PROFILE</div>
          <h1>{profile.name}</h1>
          <span className="profile-tag">{profile.tag}</span>
          <p className="result-description">{descriptions[profile.name]}</p>

          <div className="status-card">
            <span>PROFILE MATRIX RESULT</span>
            <strong>{profile.name}</strong>
            <p>{profile.thought}</p>
          </div>

          <div className="score-card combined-score-card">
            <div>
              <span>YOUR PROFILE SCORE</span>
              <strong>{profile.combinedScore}<small> / 76</small></strong>
            </div>
            <div className="score-scale">
              <span>Lower</span>
              <div className="score-line">
                <i style={{ left: `${((profile.combinedScore - 3) / 73) * 100}%` }} />
              </div>
              <span>Higher</span>
            </div>
          </div>

          <div className="status-card basket-insight">
            <span>ABOUT THIS BASKET</span>
            <strong>Gold + Silver</strong>
            <p>This basket gives you exposure to both gold and silver through one investment. Gold and silver can behave differently across market conditions, so the basket can have its own mix of stability and price movement.</p>
          </div>

          <div className="result-note">
            <strong>Remember</strong>
            <span>Your profile is a guide to your risk preference. Consider your goals, time horizon, financial commitments and ability to absorb losses before investing.</span>
          </div>

          <button className="risk-continue result-button" onClick={() => { window.location.href = "/prototype-1"; }}>
            Back to investing
          </button>
          <button className="risk-secondary" onClick={() => { window.location.href = "/risk-profile"; }}>
            Retake assessment
          </button>
        </section>
      </div>
    </main>
  );
}
