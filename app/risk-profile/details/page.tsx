"use client";

import { useEffect, useState } from "react";

type RiskProfile = {
  name: string;
  tag: string;
  score: number;
  thought: string;
};

const descriptions: Record<string, string> = {
  Conservative: "You seem more focused on protecting your money and keeping short-term fluctuations manageable.",
  "Moderately Conservative": "You seem to value stability while having some room to accept investment fluctuations.",
  Balanced: "You appear comfortable balancing stability with the possibility of higher long-term fluctuations.",
  Growth: "You appear more comfortable accepting short-term fluctuations for longer-term growth potential.",
  Aggressive: "Your answers suggest a relatively high comfort with fluctuations and a longer investment horizon."
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
          <div className="risk-progress"><strong style={{fontSize: "11px"}}>Your investor profile</strong></div>
          <span />
        </header>

        <section className="risk-result">
          <div className="result-icon">✓</div>
          <div className="risk-eyebrow">YOUR INVESTOR RISK PROFILE</div>
          <h1>{profile.name}</h1>
          <span className="profile-tag">{profile.tag}</span>
          <p className="result-description">{descriptions[profile.name] ?? "Your profile is a guide to your risk preference."}</p>

          <div className="status-card">
            <span>PROFILE SUMMARY</span>
            <strong>{profile.tag}</strong>
            <p>{profile.thought}</p>
          </div>

          <div className="score-card">
            <div>
              <span>Profile score</span>
              <strong>{profile.score}<small> / 35</small></strong>
            </div>
            <div className="score-scale">
              <span>Lower</span>
              <div className="score-line">
                <i style={{ left: `${((profile.score - 7) / 28) * 100}%` }} />
              </div>
              <span>Higher</span>
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
