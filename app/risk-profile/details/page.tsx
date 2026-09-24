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
      <style jsx>{`
        * { box-sizing: border-box; }
        .risk-page { min-height:100vh; display:flex; justify-content:center; background:#f1f1f1; color:#181820; font-family:Inter,Arial,sans-serif; }
        .risk-label { position:fixed; top:8px; right:10px; z-index:30; font-size:8px; letter-spacing:.07em; color:#777; }
        .risk-phone { position:relative; width:360px; min-height:880px; height:880px; overflow-x:hidden; overflow-y:auto; background:#fff; box-shadow:0 10px 40px #0001; }
        button { font:inherit; cursor:pointer; -webkit-tap-highlight-color:transparent; }
        .risk-header { height:86px; padding:28px 16px 12px; display:grid; grid-template-columns:34px 1fr 34px; align-items:center; gap:8px; }
        .risk-back { border:0; background:transparent; color:#191922; font-size:27px; font-weight:300; }
        .risk-progress { display:flex; align-items:center; }
        .risk-eyebrow { color:#68687a; font-size:9px; letter-spacing:.12em; font-weight:700; }
        .risk-result { min-height:100%; padding:44px 17px 40px; }
        .result-icon { width:42px; height:42px; display:grid; place-items:center; margin-bottom:17px; border-radius:50%; background:#4a4965; color:#fff; font-size:18px; }
        .risk-result h1 { margin:8px 0 8px; font-size:30px; letter-spacing:-.05em; line-height:1.05; }
        .profile-tag { display:inline-flex; padding:6px 9px; border-radius:999px; background:#efeff4; color:#555565; font-size:9px; font-weight:700; }
        .result-description { margin:12px 0 16px; color:#626275; font-size:11px; line-height:1.45; }
        .status-card,.score-card,.result-note { border:1.5px solid #e1e1e6; border-radius:12px; background:#fff; }
        .status-card { margin:12px 0 9px; padding:15px; background:#f5f4fa; border-color:#dedde8; }
        .status-card > span { display:block; color:#777789; font-size:8px; letter-spacing:.08em; font-weight:700; }
        .status-card strong { display:block; margin-top:5px; font-size:19px; letter-spacing:-.03em; }
        .status-card p { margin:7px 0 0; color:#666675; font-size:9px; line-height:1.45; }
        .score-card { padding:12px; display:grid; grid-template-columns:92px 1fr; align-items:center; gap:10px; margin-bottom:9px; }
        .score-card span { display:block; color:#777789; font-size:8px; }
        .score-card strong { display:block; margin-top:2px; font-size:21px; letter-spacing:-.04em; }
        .score-card strong small { color:#8a8a98; font-size:9px; font-weight:500; }
        .score-scale { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:6px; }
        .score-scale span { font-size:7px; }
        .score-line { position:relative; height:4px; border-radius:99px; background:linear-gradient(90deg,#d9d9df,#77768d); }
        .score-line i { position:absolute; top:50%; width:12px; height:12px; transform:translate(-50%,-50%); border:2px solid #fff; border-radius:50%; background:#4a4965; box-shadow:0 1px 4px #0003; }
        .basket-insight { background:#f8faf9; border-color:#dce6e1; }
        .result-note { display:flex; gap:7px; padding:10px; background:#f8f8f9; }
        .result-note strong { font-size:8px; white-space:nowrap; }
        .result-note span { color:#747481; font-size:7px; line-height:1.35; }
        .risk-continue { width:100%; height:48px; margin-top:10px; border:0; border-radius:7px; background:#4a4965; color:#fff; font-size:13px; font-weight:700; }
        .result-button { background:#fff; color:#4a4965; border:1.5px solid #4a4965; }
        .risk-secondary { width:100%; height:44px; margin-top:8px; border:1.5px solid #dedde5; border-radius:7px; background:#fff; color:#555565; font-size:12px; font-weight:700; }
        @media (max-width:600px) { .risk-page { background:#fff; } .risk-phone { width:100vw; height:100vh; min-height:100vh; box-shadow:none; } }
`}</style>
    </main>
  );
}
