"use client";

import { useEffect, useState } from "react";

type RiskProfile = {
  name: string;
  tag: string;
  thought: string;
  timeScore: number;
  riskScore: number;
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

          <div className="score-card">
            <div>
              <span>Time Horizon</span>
              <strong>{profile.timeScore}<small> / 36</small></strong>
            </div>
            <div>
              <span>Risk Score</span>
              <strong>{profile.riskScore}<small> / 40</small></strong>
            </div>
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
