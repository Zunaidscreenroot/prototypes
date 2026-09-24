"use client";

import { useMemo, useState } from "react";

type Answer = { label: string; score: number; detail?: string };

const questions: {
  eyebrow: string;
  title: string;
  helper: string;
  answers: Answer[];
}[] = [
  {
    eyebrow: "01 / 07 · LIFE STAGE",
    title: "How would you describe your current stage of life?",
    helper: "This helps us understand how long your money may need to stay invested.",
    answers: [
      { label: "Retired or close to retirement", score: 1 },
      { label: "Building financial stability", score: 2 },
      { label: "Established with a stable income", score: 3 },
      { label: "Early in my earning journey", score: 4 },
      { label: "Long earning horizon ahead", score: 5 }
    ]
  },
  {
    eyebrow: "02 / 07 · GOAL",
    title: "What is the main reason you want to invest?",
    helper: "Choose the goal that best describes what you want this money to do.",
    answers: [
      { label: "Protect my savings from losing value", score: 1 },
      { label: "Build a stable reserve", score: 2 },
      { label: "Balance protection and growth", score: 3 },
      { label: "Build wealth over time", score: 4 },
      { label: "Maximise long-term growth potential", score: 5 }
    ]
  },
  {
    eyebrow: "03 / 07 · TIME HORIZON",
    title: "When do you expect to need this money?",
    helper: "A longer horizon can give you more time to ride out market fluctuations.",
    answers: [
      { label: "Within 1 year", score: 1 },
      { label: "1–3 years", score: 2 },
      { label: "3–5 years", score: 3 },
      { label: "5–10 years", score: 4 },
      { label: "10+ years", score: 5 }
    ]
  },
  {
    eyebrow: "04 / 07 · INCOME",
    title: "How predictable is your income?",
    helper: "This helps estimate how much investment volatility you may be able to absorb.",
    answers: [
      { label: "Mostly dependent on pension / savings", score: 1 },
      { label: "Income can vary significantly", score: 2 },
      { label: "Reasonably stable income", score: 3 },
      { label: "Stable income with a good buffer", score: 4 },
      { label: "Very stable income and long earning runway", score: 5 }
    ]
  },
  {
    eyebrow: "05 / 07 · EXPERIENCE",
    title: "How familiar are you with market-linked investments?",
    helper: "There are no right answers. Tell us what you have actually experienced.",
    answers: [
      { label: "I have never invested in market-linked products", score: 1 },
      { label: "I have used deposits or simple savings products", score: 2 },
      { label: "I have some experience with mutual funds / ETFs", score: 3 },
      { label: "I understand market ups and downs", score: 4 },
      { label: "I actively manage a diversified portfolio", score: 5 }
    ]
  },
  {
    eyebrow: "06 / 07 · LOSS TOLERANCE",
    title: "If your investment fell 20% for a short period, what would you do?",
    helper: "Short-term declines can happen in market-linked investments. Choose your most likely reaction.",
    answers: [
      { label: "I would want to exit to protect the remaining money", score: 1 },
      { label: "I would feel very uncomfortable and reconsider", score: 2 },
      { label: "I would wait and review the situation", score: 3 },
      { label: "I would stay invested if my goal had not changed", score: 4 },
      { label: "I could stay invested and consider investing more", score: 5 }
    ]
  },
  {
    eyebrow: "07 / 07 · FINANCIAL COMMITMENTS",
    title: "How much of your available money is already committed?",
    helper: "Think about EMIs, dependants, emergency needs and other near-term obligations.",
    answers: [
      { label: "Most of it is committed to essential needs", score: 1 },
      { label: "A large part is committed", score: 2 },
      { label: "I have a balanced mix of commitments and surplus", score: 3 },
      { label: "I have a healthy surplus after commitments", score: 4 },
      { label: "I have substantial surplus and an emergency buffer", score: 5 }
    ]
  }
];

const profiles = [
  {
    min: 7,
    max: 12,
    name: "Conservative",
    tag: "Lower risk preference",
    description: "You seem more focused on protecting your money and keeping short-term fluctuations manageable.",
    thought: "Think about how much of your investment you can comfortably leave untouched before choosing an amount."
  },
  {
    min: 13,
    max: 18,
    name: "Moderately Conservative",
    tag: "Lower to moderate risk preference",
    description: "You seem to value stability while having some room to accept investment fluctuations.",
    thought: "Think about your time horizon and whether you can stay invested when markets move up or down."
  },
  {
    min: 19,
    max: 24,
    name: "Balanced",
    tag: "Moderate risk preference",
    description: "You appear comfortable balancing stability with the possibility of higher long-term fluctuations.",
    thought: "Think about balancing your investment amount with your other financial commitments."
  },
  {
    min: 25,
    max: 30,
    name: "Growth",
    tag: "Higher risk preference",
    description: "You appear more comfortable accepting short-term fluctuations for longer-term growth potential.",
    thought: "Think about whether you have enough time to stay invested through periods of market volatility."
  },
  {
    min: 31,
    max: 35,
    name: "Aggressive",
    tag: "Higher risk preference",
    description: "Your answers suggest a relatively high comfort with fluctuations and a longer investment horizon.",
    thought: "Think about whether a higher level of fluctuation still fits your goals and financial capacity."
  }
];

export default function RiskProfilePrototype() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const score = useMemo(
    () => answers.reduce((sum, value) => sum + value, 0),
    [answers]
  );

  const profile = useMemo(
    () => profiles.find((item) => score >= item.min && score <= item.max) ?? profiles[1],
    [score]
  );

  const fundPlan = useMemo(
    () => calculateFundAllocation(monthlyAmount, profile.gold),
    [monthlyAmount, profile.gold]
  );

  const blendedRate = useMemo(() => {
    if (!fundPlan.allocation) return 0;
    const total = monthlyAmount;
    return (
      (fundPlan.allocation.edelweiss * fundConfig.edelweiss.annualRate +
        fundPlan.allocation.hdfcGold * fundConfig.hdfcGold.annualRate +
        fundPlan.allocation.nipponSilver * fundConfig.nipponSilver.annualRate) /
      total
    );
  }, [fundPlan, monthlyAmount]);

  const threeYearValue = sipFutureValue(monthlyAmount, blendedRate, 3);
  const fiveYearValue = sipFutureValue(monthlyAmount, blendedRate, 5);

  const selectAnswer = (answerScore: number) => {
    setSelected(answerScore);
  };

  const next = () => {
    if (selected === null) return;

    const nextAnswers = [...answers];
    nextAnswers[step] = selected;
    setAnswers(nextAnswers);

    if (step === questions.length - 1) {
      const finalScore = nextAnswers.reduce((sum, value) => sum + value, 0);
      const finalProfile = profiles.find((item) => finalScore >= item.min && finalScore <= item.max) ?? profiles[2];
      window.localStorage.setItem("riskProfile", JSON.stringify({
        name: finalProfile.name,
        tag: finalProfile.tag,
        score: finalScore,
        thought: finalProfile.thought
      }));
      setStep(questions.length);
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
        {step < questions.length ? (
          <>
            <header className="risk-header">
              <button className="risk-back" onClick={back} disabled={step === 0}>
                ←
              </button>
              <div className="risk-progress">
                <div className="risk-progress-track">
                  <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>
                <small>{step + 1} of {questions.length}</small>
              </div>
              <button className="risk-help" onClick={() => setShowInfo(true)}>?</button>
            </header>

            <section className="risk-question">
              <div className="risk-eyebrow">{questions[step].eyebrow}</div>
              <h1>{questions[step].title}</h1>
              <p>{questions[step].helper}</p>

              <div className="risk-options">
                {questions[step].answers.map((answer) => (
                  <button
                    key={answer.label}
                    className={selected === answer.score ? "risk-option selected" : "risk-option"}
                    onClick={() => selectAnswer(answer.score)}
                  >
                    <span className="risk-radio">
                      {selected === answer.score ? "✓" : ""}
                    </span>
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
              <span>Your answers help us understand your risk preference</span>
            </footer>
          </>
        ) : (
          <section className="risk-result">
            <div className="result-icon">✓</div>
            <div className="risk-eyebrow">YOUR INVESTOR RISK PROFILE</div>
            <h1>{profile.name}</h1>
            <span className="profile-tag">{profile.tag}</span>
            <p className="result-description">{profile.description}</p>

            <div className="status-card">
              <span>YOUR PROFILE STATUS</span>
              <strong>{profile.name}</strong>
              <p>{profile.thought}</p>
            </div>

            <div className="score-card">
              <div>
                <span>Profile score</span>
                <strong>{score}<small> / 35</small></strong>
              </div>
              <div className="score-scale">
                <span>Lower</span>
                <div className="score-line">
                  <i style={{ left: `${((score - 7) / 28) * 100}%` }} />
                </div>
                <span>Higher</span>
              </div>
            </div>

            <div className="result-note">
              <strong>Remember</strong>
              <span>Your profile is a guide to your risk preference. Review it alongside your goals, time horizon and financial situation before investing.</span>
            </div>

            <button className="risk-continue result-button" onClick={() => { window.location.href = "/prototype-1"; }}>
              Go to investing
            </button>
            <button className="risk-secondary" onClick={restart}>Retake assessment</button>
          </section>
        )}

        {showInfo && (
          <div className="risk-overlay" onClick={() => setShowInfo(false)}>
            <div className="risk-sheet" onClick={(event) => event.stopPropagation()}>
              <div className="sheet-handle" />
              <h2>How your profile is calculated</h2>
              <p>
                We use seven dimensions: life stage, goal, time horizon, income stability,
                investment experience, loss tolerance and financial commitments.
              </p>
              <p>
                Each answer contributes 1–5 points. Your responses are combined into an
                indicative investor risk profile, from Conservative to Aggressive.
              </p>
              <p className="sheet-source">This questionnaire is a prototype and is not a recommendation to buy or sell an investment product.</p>
              <button onClick={() => setShowInfo(false)}>Got it</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
        .risk-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          background: #f1f1f1;
          color: #181820;
          font-family: Inter, Arial, sans-serif;
        }
        .risk-label {
          position: fixed;
          top: 8px;
          right: 10px;
          z-index: 30;
          font-size: 8px;
          letter-spacing: .07em;
          color: #777;
        }
        .risk-phone {
          position: relative;
          width: 360px;
          min-height: 880px;
          height: 880px;
          overflow-x: hidden;
          overflow-y: auto;
          background: #fff;
          box-shadow: 0 10px 40px #0001;
        }
        button { font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .risk-header {
          height: 86px;
          padding: 28px 16px 12px;
          display: grid;
          grid-template-columns: 34px 1fr 34px;
          align-items: center;
          gap: 8px;
        }
        .risk-back, .risk-help {
          border: 0;
          background: transparent;
          color: #191922;
        }
        .risk-back { font-size: 27px; font-weight: 300; }
        .risk-back:disabled { opacity: .2; cursor: default; }
        .risk-help {
          justify-self: end;
          width: 21px;
          height: 21px;
          border: 1.5px solid #454550;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
        }
        .risk-progress { display: flex; align-items: center; gap: 9px; }
        .risk-progress-track {
          height: 4px;
          flex: 1;
          overflow: hidden;
          border-radius: 99px;
          background: #e5e5e9;
        }
        .risk-progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #4a4965;
          transition: width .2s ease;
        }
        .risk-progress small { color: #777786; font-size: 9px; white-space: nowrap; }
        .risk-question { padding: 22px 20px 112px; }
        .risk-eyebrow {
          color: #68687a;
          font-size: 9px;
          letter-spacing: .12em;
          font-weight: 700;
        }
        .risk-question h1 {
          margin: 13px 0 10px;
          max-width: 305px;
          font-size: 27px;
          line-height: 1.08;
          letter-spacing: -.045em;
          font-weight: 650;
        }
        .risk-question > p {
          margin: 0 0 25px;
          max-width: 310px;
          color: #68687a;
          font-size: 11px;
          line-height: 1.45;
        }
        .risk-options { display: grid; gap: 9px; }
        .risk-option {
          min-height: 57px;
          width: 100%;
          padding: 12px 13px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px solid #dedee4;
          border-radius: 12px;
          background: #fff;
          color: #30303b;
          text-align: left;
          font-size: 12px;
          line-height: 1.25;
          transition: border-color .15s, background .15s, transform .15s;
        }
        .risk-option:hover { border-color: #9b9aa9; }
        .risk-option.selected {
          border-color: #4a4965;
          background: #f5f4fa;
        }
        .risk-radio {
          flex: 0 0 20px;
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border: 1.5px solid #898895;
          border-radius: 50%;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }
        .risk-option.selected .risk-radio {
          border-color: #4a4965;
          background: #4a4965;
        }
        .risk-footer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px 16px 20px;
          background: linear-gradient(to bottom, #ffffff00, #fff 24%);
        }
        .risk-continue {
          width: 100%;
          height: 48px;
          border: 0;
          border-radius: 7px;
          background: #4a4965;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }
        .risk-continue.disabled { opacity: .38; cursor: default; }
        .risk-footer span {
          display: block;
          margin-top: 7px;
          text-align: center;
          color: #888896;
          font-size: 8px;
        }
        .risk-result {
          min-height: 100%;
          padding: 44px 17px 40px;
        }
        .result-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 50%;
          background: #4a4965;
          color: #fff;
          font-size: 18px;
        }
        .risk-result h1 {
          margin: 8px 0 8px;
          font-size: 30px;
          letter-spacing: -.05em;
          line-height: 1.05;
        }
        .profile-tag {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          background: #efeff4;
          color: #555565;
          font-size: 9px;
          font-weight: 700;
        }
        .result-description {
          margin: 12px 0 16px;
          color: #626275;
          font-size: 11px;
          line-height: 1.45;
        }
        .score-card, .basket-card, .fund-suggestions, .result-note {
          border: 1.5px solid #e1e1e6;
          border-radius: 12px;
          background: #fff;
        }
        .score-card {
          padding: 12px;
          display: grid;
          grid-template-columns: 92px 1fr;
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }
        .score-card span { display: block; color: #777789; font-size: 8px; }
        .score-card strong { display: block; margin-top: 2px; font-size: 21px; letter-spacing: -.04em; }
        .score-card strong small { color: #8a8a98; font-size: 9px; font-weight: 500; }
        .score-scale { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 6px; }
        .score-scale span { font-size: 7px; }
        .score-line { position: relative; height: 4px; border-radius: 99px; background: linear-gradient(90deg, #d9d9df, #77768d); }
        .score-line i { position: absolute; top: 50%; width: 12px; height: 12px; transform: translate(-50%, -50%); border: 2px solid #fff; border-radius: 50%; background: #4a4965; box-shadow: 0 1px 4px #0003; }
        .basket-card { padding: 13px; margin-bottom: 9px; }
        .basket-heading { display: flex; justify-content: space-between; align-items: flex-start; }
        .basket-heading span, .fund-title { color: #777789; font-size: 8px; }
        .basket-heading h2 { margin: 3px 0 0; font-size: 15px; letter-spacing: -.02em; }
        .basket-heading button {
          width: 21px; height: 21px; border-radius: 50%; border: 1px solid #8b8b97;
          background: #fff; color: #555565; font-size: 10px;
        }
        .allocation-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 15px; }
        .allocation-row div { padding: 9px; border-radius: 8px; background: #f4f4f6; }
        .allocation-row span { display: block; color: #777789; font-size: 8px; }
        .allocation-row strong { display: block; margin-top: 3px; font-size: 18px; }
        .allocation-bar { display: flex; height: 7px; overflow: hidden; margin-top: 9px; border-radius: 99px; background: #e4e4e8; }
        .allocation-bar span:first-child { background: #4a4965; }
        .allocation-bar span:last-child { background: #a6a5b2; }
        .basket-card p { margin: 10px 0 0; color: #6c6c7a; font-size: 8px; line-height: 1.4; }
        .result-note { display: flex; gap: 7px; padding: 10px; background: #f8f8f9; }
        .result-note strong { font-size: 8px; white-space: nowrap; }
        .result-note span { color: #747481; font-size: 7px; line-height: 1.35; }
        .result-button { margin-top: 10px; background: #fff; color: #4a4965; border: 1.5px solid #4a4965; }
        .risk-overlay { position: absolute; inset: 0; z-index: 20; display: flex; align-items: flex-end; background: rgba(0,0,0,.66); }
        .risk-sheet { width: 100%; padding: 18px 16px 28px; border-radius: 14px 14px 0 0; background: #fff; }
        .sheet-handle { width: 38px; height: 3px; margin: 0 auto 18px; border-radius: 99px; background: #777; }
        .risk-sheet h2 { margin: 0 0 9px; font-size: 18px; }
        .risk-sheet p { margin: 0 0 9px; color: #656575; font-size: 10px; line-height: 1.45; }
        .risk-sheet .sheet-source { color: #858592; font-size: 8px; }
        .risk-sheet button { width: 100%; height: 44px; margin-top: 8px; border: 0; border-radius: 6px; background: #4a4965; color: #fff; font-size: 12px; font-weight: 700; }
        @media (max-width: 600px) {
          .risk-page { background: #fff; }
          .risk-phone { width: 100vw; height: 100vh; min-height: 100vh; box-shadow: none; }
        }

        .status-card {
          margin: 12px 0 9px;
          padding: 15px;
          border-radius: 12px;
          background: #f5f4fa;
          border: 1.5px solid #dedde8;
        }
        .status-card > span { display: block; color: #777789; font-size: 8px; letter-spacing: .08em; font-weight: 700; }
        .status-card strong { display: block; margin-top: 5px; font-size: 19px; letter-spacing: -.03em; }
        .status-card p { margin: 7px 0 0; color: #666675; font-size: 9px; line-height: 1.45; }
        .risk-secondary {
          width: 100%;
          height: 44px;
          margin-top: 8px;
          border: 1.5px solid #dedde5;
          border-radius: 7px;
          background: #fff;
          color: #555565;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
