"use client";

import { useState } from "react";

type Answer = { label: string; score: number };

type Question = {
  section: "time" | "risk";
  eyebrow: string;
  title: string;
  helper: string;
  answers: Answer[];
};

const questions: Question[] = [
  {
    section: "time",
    eyebrow: "01 / 06 · TIME HORIZON",
    title: "When do you expect to start accessing or withdrawing these funds?",
    helper: "Think about when you may first need to use this money.",
    answers: [
      { label: "Less than 3 years", score: 3 },
      { label: "3–5 years", score: 8 },
      { label: "6–10 years", score: 13 },
      { label: "More than 10 years", score: 18 }
    ]
  },
  {
    section: "time",
    eyebrow: "02 / 06 · INVESTMENT GOAL",
    title: "What is the primary purpose or goal for this investment?",
    helper: "Choose the goal that best matches why you are investing.",
    answers: [
      { label: "Emergency safety net / Short-term liquidity", score: 0 },
      { label: "Short-term purchase (<3 years)", score: 3 },
      { label: "Long-term wealth creation (>5 years)", score: 12 },
      { label: "Retirement or long-term legacy", score: 18 }
    ]
  },
  {
    section: "risk",
    eyebrow: "03 / 06 · EXPERIENCE",
    title: "How would you describe your investment experience?",
    helper: "Choose the level that best reflects your experience with investments.",
    answers: [
      { label: "Very limited / Beginner", score: 0 },
      { label: "Some experience", score: 4 },
      { label: "Good experience", score: 7 },
      { label: "Extensive experience", score: 10 }
    ]
  },
  {
    section: "risk",
    eyebrow: "04 / 06 · VOLATILITY COMFORT",
    title: "How comfortable are you with short-term fluctuations?",
    helper: "Market-linked investments can move up and down over shorter periods.",
    answers: [
      { label: "Not comfortable — I prefer stability", score: 0 },
      { label: "Somewhat comfortable", score: 4 },
      { label: "Comfortable", score: 7 },
      { label: "Very comfortable", score: 10 }
    ]
  },
  {
    section: "risk",
    eyebrow: "05 / 06 · LOSS RESPONSE",
    title: "If your portfolio declined by 20% in a year, what would you most likely do?",
    helper: "Choose the response closest to what you would actually do.",
    answers: [
      { label: "Sell all or most of my investments", score: 0 },
      { label: "Sell some of my investments", score: 3 },
      { label: "Do nothing and wait for recovery", score: 7 },
      { label: "Buy more — I see it as an opportunity", score: 10 }
    ]
  },
  {
    section: "risk",
    eyebrow: "06 / 06 · INVESTMENT OBJECTIVE",
    title: "What is your primary investment objective?",
    helper: "Choose the outcome that best matches your investment objective.",
    answers: [
      { label: "Preserve capital / Avoid risk", score: 0 },
      { label: "Generate income with some growth", score: 4 },
      { label: "Balanced growth and income", score: 7 },
      { label: "Maximize long-term growth", score: 10 }
    ]
  }
];

const getProfile = (timeScore: number, riskScore: number) => {
  // Matrix from the provided investor risk profile reference.
  if (timeScore <= 9) return "Conservative";
  if (timeScore <= 18) {
    if (riskScore <= 20) return "Conservative";
    if (riskScore <= 30) return "Moderately Conservative";
    return "Balanced";
  }
  if (timeScore <= 27) {
    if (riskScore <= 10) return "Conservative";
    if (riskScore <= 20) return "Moderately Conservative";
    if (riskScore <= 30) return "Balanced";
    return "Growth";
  }
  if (riskScore <= 10) return "Moderately Conservative";
  if (riskScore <= 20) return "Balanced";
  if (riskScore <= 30) return "Growth";
  return "Aggressive";
};

const profileDetails: Record<string, { tag: string; thought: string }> = {
  Conservative: {
    tag: "Focus on capital preservation · Low risk tolerance",
    thought: "Your profile places more emphasis on stability and protecting invested capital."
  },
  "Moderately Conservative": {
    tag: "Income with low growth · Lower volatility",
    thought: "Your profile balances a preference for stability with some room for investment fluctuations."
  },
  Balanced: {
    tag: "Balance of growth & income · Moderate risk",
    thought: "Your profile reflects a balance between growth potential, income and moderate fluctuations."
  },
  Growth: {
    tag: "Strong long-term growth · Higher volatility",
    thought: "Your profile indicates greater comfort with fluctuations in pursuit of long-term growth."
  },
  Aggressive: {
    tag: "Maximum long-term growth · High volatility tolerance",
    thought: "Your profile indicates a higher tolerance for investment volatility and a long-term growth focus."
  }
};

export default function RiskProfilePrototype() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const question = questions[step];

  const next = () => {
    if (selected === null) return;

    const nextAnswers = [...answers];
    nextAnswers[step] = selected;
    setAnswers(nextAnswers);

    if (step === questions.length - 1) {
      const timeScore = nextAnswers.slice(0, 2).reduce((sum, value) => sum + value, 0);
      const riskScore = nextAnswers.slice(2).reduce((sum, value) => sum + value, 0);
      const name = getProfile(timeScore, riskScore);
      const detail = profileDetails[name];

      window.localStorage.setItem("riskProfile", JSON.stringify({
        name,
        tag: detail.tag,
        thought: detail.thought,
        timeScore,
        riskScore,
        combinedScore: timeScore + riskScore
      }));

      window.location.href = "/prototype-1";
      return;
    }

    setStep(step + 1);
    setSelected(nextAnswers[step + 1] ?? null);
  };

  const back = () => {
    if (step === 0) return;
    const previous = step - 1;
    setStep(previous);
    setSelected(answers[previous] ?? null);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setSelected(null);
  };

  return (
    <main className="risk-page">
      <div className="risk-label">SCREENROOT · RISK PROFILE PROTOTYPE</div>

      <div className="risk-phone">
        <header className="risk-header">
          <button className="risk-back" onClick={back} disabled={step === 0}>←</button>
          <div className="risk-progress">
            <div className="risk-progress-track">
              <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>
            <small>{step + 1} of {questions.length}</small>
          </div>
          <button className="risk-help" onClick={() => setShowInfo(true)}>?</button>
        </header>

        <section className="risk-question">
          <div className="risk-eyebrow">{question.eyebrow}</div>
          <h1>{question.title}</h1>
          <p>{question.helper}</p>

          <div className="risk-options">
            {question.answers.map((answer) => (
              <button
                key={answer.label}
                className={selected === answer.score ? "risk-option selected" : "risk-option"}
                onClick={() => setSelected(answer.score)}
              >
                <span className="risk-radio">{selected === answer.score ? "✓" : ""}</span>
                <span>{answer.label}</span>
                
              </button>
            ))}
          </div>
        </section>

        <footer className="risk-footer">
          <button
            className={selected === null ? "risk-continue disabled" : "risk-continue"}
            disabled={selected === null}
            onClick={next}
          >
            {step === questions.length - 1 ? "See my risk profile" : "Continue"}
          </button>
          <span>{question.section === "time" ? "TIME HORIZON & GOAL" : "RISK ASSESSMENT"}</span>
        </footer>

        {showInfo && (
          <div className="risk-overlay" onClick={() => setShowInfo(false)}>
            <div className="risk-sheet" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <h2>About your investor profile</h2>
              <p>Your answers are used to understand your time horizon, investment experience, comfort with fluctuations and investment objectives.</p>
              <p className="sheet-source">Your profile is a guide to your risk preference and is not a recommendation to buy or sell an investment product.</p>
              <button onClick={() => setShowInfo(false)}>Got it</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
        .risk-page { min-height: 100vh; display: flex; justify-content: center; background: #f1f1f1; color: #181820; font-family: Inter, Arial, sans-serif; }
        .risk-label { position: fixed; top: 8px; right: 10px; z-index: 30; font-size: 8px; letter-spacing: .07em; color: #777; }
        .risk-phone { position: relative; width: 360px; min-height: 880px; height: 880px; overflow-x: hidden; overflow-y: auto; background: #fff; box-shadow: 0 10px 40px #0001; }
        button { font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .risk-header { height: 86px; padding: 28px 16px 12px; display: grid; grid-template-columns: 34px 1fr 34px; align-items: center; gap: 8px; }
        .risk-back, .risk-help { border: 0; background: transparent; color: #191922; }
        .risk-back { font-size: 27px; font-weight: 300; }
        .risk-back:disabled { opacity: .2; cursor: default; }
        .risk-help { justify-self: end; width: 21px; height: 21px; border: 1.5px solid #454550; border-radius: 50%; font-size: 12px; font-weight: 700; }
        .risk-progress { display: flex; align-items: center; gap: 9px; }
        .risk-progress-track { height: 4px; flex: 1; overflow: hidden; border-radius: 99px; background: #e5e5e9; }
        .risk-progress-track span { display: block; height: 100%; border-radius: inherit; background: #4a4965; transition: width .2s ease; }
        .risk-progress small { color: #777786; font-size: 9px; white-space: nowrap; }
        .risk-question { padding: 22px 20px 112px; }
        .risk-eyebrow { color: #68687a; font-size: 9px; letter-spacing: .12em; font-weight: 700; }
        .risk-question h1 { margin: 13px 0 10px; max-width: 320px; font-size: 25px; line-height: 1.08; letter-spacing: -.045em; font-weight: 650; }
        .risk-question > p { margin: 0 0 25px; max-width: 310px; color: #68687a; font-size: 11px; line-height: 1.45; }
        .risk-options { display: grid; gap: 9px; }
        .risk-option { min-height: 57px; width: 100%; padding: 11px 12px; display: grid; grid-template-columns: 20px 1fr auto; align-items: center; gap: 10px; border: 1.5px solid #dedee4; border-radius: 12px; background: #fff; color: #30303b; text-align: left; font-size: 11px; line-height: 1.25; }
        .risk-option.selected { border-color: #4a4965; background: #f5f4fa; }
        .risk-option strong { color: #777789; font-size: 9px; white-space: nowrap; }
        .risk-radio { width: 20px; height: 20px; display: grid; place-items: center; border: 1.5px solid #898895; border-radius: 50%; color: #fff; font-size: 11px; font-weight: 800; }
        .risk-option.selected .risk-radio { border-color: #4a4965; background: #4a4965; }
        .risk-footer { position: absolute; left: 0; right: 0; bottom: 0; padding: 12px 16px 20px; background: linear-gradient(to bottom, #ffffff00, #fff 24%); }
        .risk-continue { width: 100%; height: 48px; border: 0; border-radius: 7px; background: #4a4965; color: #fff; font-size: 13px; font-weight: 700; }
        .risk-continue.disabled { opacity: .38; cursor: default; }
        .risk-footer span { display: block; margin-top: 7px; text-align: center; color: #888896; font-size: 8px; }
        .risk-overlay { position: absolute; inset: 0; z-index: 20; display: flex; align-items: flex-end; background: rgba(0,0,0,.66); }
        .risk-sheet { width: 100%; padding: 18px 16px 28px; border-radius: 14px 14px 0 0; background: #fff; }
        .sheet-handle { width: 38px; height: 3px; margin: 0 auto 18px; border-radius: 99px; background: #777; }
        .risk-sheet h2 { margin: 0 0 9px; font-size: 18px; }
        .risk-sheet p { margin: 0 0 9px; color: #656575; font-size: 10px; line-height: 1.45; }
        .risk-sheet .sheet-source { color: #858592; font-size: 8px; }
        .risk-sheet button { width: 100%; height: 44px; margin-top: 8px; border: 0; border-radius: 6px; background: #4a4965; color: #fff; font-size: 12px; font-weight: 700; }
        @media (max-width: 600px) { .risk-page { background: #fff; } .risk-phone { width: 100vw; height: 100vh; min-height: 100vh; box-shadow: none; } }
      `}</style>
    </main>
  );
}
