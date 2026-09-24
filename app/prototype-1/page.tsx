"use client";

import { useEffect, useMemo, useState } from "react";

const funds = {
  edelweiss: {
    title: "Gold+Silver",
    provider: "Edelweiss Gold and Silver ETF Fund of Funds",
    gold: 50,
    silver: 50,
    min: 100
  },
  gold: {
    title: "Only Gold",
    provider: "HDFC Gold Fund",
    gold: 100,
    silver: 0,
    min: 100
  },
  silver: {
    title: "Only Silver",
    provider: "Nippon Silver Fund",
    gold: 0,
    silver: 100,
    min: 100
  }
} as const;

type FundKey = keyof typeof funds;

const presets = [100, 200, 300, 500, 1000];

const formatAmount = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const parseAmount = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;

export default function PrototypeOne() {
  const [edelweiss, setEdelweiss] = useState(true);
  const [axisGold, setAxisGold] = useState(true);
  const [axisSilver, setAxisSilver] = useState(true);
  const [baseAmount, setBaseAmount] = useState(300);
  const [fundAmounts, setFundAmounts] = useState({ edelweiss: 100, gold: 100, silver: 100 });
  const [riskProfile, setRiskProfile] = useState<{ name: string; tag: string; score: number; thought: string } | null>(null);
  const [frequency, setFrequency] = useState("Daily");
  const [sheet, setSheet] = useState(false);
  const [mode, setMode] = useState<"sip" | "oneTime">("sip");
  const [dark, setDark] = useState(false);
  const [oneTimeAmount, setOneTimeAmount] = useState(45000);
  const [oneTimeInput, setOneTimeInput] = useState("45000");
  const [sipInput, setSipInput] = useState("300");

  const selected = useMemo(() => {
    const keys: FundKey[] = [];
    if (edelweiss) keys.push("edelweiss");
    if (axisGold) keys.push("gold");
    if (axisSilver) keys.push("silver");
    return keys.map(key => ({ key, amount: fundAmounts[key] }));
  }, [edelweiss, axisGold, axisSilver, fundAmounts]);

  const selectedCount = Number(edelweiss) + Number(axisGold) + Number(axisSilver);
  const frequencyMinimum = frequency === "Daily" ? 100 : frequency === "Weekly" ? 1000 : 5000;
  const frequencyMaximum = frequency === "Daily" ? 2000 : frequency === "Weekly" ? 20000 : 50000;
  const sipMinimum = Math.max(frequencyMinimum, selectedCount * 100);
  const sipMaximum = frequencyMaximum;
  const sipStep = frequency === "Daily" ? 100 : frequency === "Weekly" ? 1000 : 5000;
  const total = selected.reduce((sum, item) => sum + item.amount, 0);
  const minimumAmount = mode === "oneTime" ? 1000 : sipMinimum;
  const currentInput = mode === "oneTime" ? oneTimeInput : sipInput;
  const currentInputAmount = parseAmount(currentInput);
  const amountError = currentInput !== "" && currentInputAmount < minimumAmount
    ? `Minimum amount is ₹${formatAmount(minimumAmount)}`
    : currentInput === ""
      ? `Minimum amount is ₹${formatAmount(minimumAmount)}`
      : "";

  const distributeTotal = (value: number, activeKeys: FundKey[]) => {
    const minimumPerFund = 100;
    const minimumTotal = activeKeys.length * minimumPerFund;
    const safeTotal = Math.max(minimumTotal, Math.round(value / 100) * 100);
    const next = { edelweiss: 0, gold: 0, silver: 0 };
    activeKeys.forEach(key => { next[key] = minimumPerFund; });
    let remaining = safeTotal - minimumTotal;
    let index = 0;
    while (remaining >= 100 && activeKeys.length) {
      next[activeKeys[index % activeKeys.length]] += 100;
      remaining -= 100;
      index += 1;
    }
    setFundAmounts(next);
    setBaseAmount(safeTotal);
    setSipInput(String(safeTotal));
  };

  const setTotalAmount = (value: number) => {
    const activeKeys: FundKey[] = [];
    if (edelweiss) activeKeys.push("edelweiss");
    if (axisGold) activeKeys.push("gold");
    if (axisSilver) activeKeys.push("silver");
    distributeTotal(value, activeKeys.length ? activeKeys : ["edelweiss", "gold", "silver"]);
  };

  const adjustFund = (key: FundKey, delta: number) => {
    const current = fundAmounts[key];
    const nextAmount = Math.max(0, current + delta);
    setFundAmounts(prev => ({ ...prev, [key]: nextAmount }));
    if (nextAmount === 0) {
      if (key === "edelweiss") setEdelweiss(false);
      if (key === "gold") setAxisGold(false);
      if (key === "silver") setAxisSilver(false);
    } else {
      if (key === "edelweiss") setEdelweiss(true);
      if (key === "gold") setAxisGold(true);
      if (key === "silver") setAxisSilver(true);
    }
    const nextTotal = selected.reduce((sum, item) => sum + item.amount, 0) - current + nextAmount;
    setBaseAmount(nextTotal);
    setSipInput(String(nextTotal));
  };

  const loadRiskProfile = () => {
    try {
      const saved = window.localStorage.getItem("riskProfile");
      if (saved) setRiskProfile(JSON.parse(saved));
    } catch {}
  };

  useEffect(() => {
    loadRiskProfile();
  }, []);

  const goldAmount = selected.reduce(
    (sum, item) => sum + item.amount * funds[item.key].gold / 100,
    0
  );

  const silverAmount = selected.reduce(
    (sum, item) => sum + item.amount * funds[item.key].silver / 100,
    0
  );

  const goldPercent = total ? goldAmount / total * 100 : 0;
  const silverPercent = total ? silverAmount / total * 100 : 0;

  const setPreset = (value: number) => {
    if (mode === "oneTime") {
      setOneTimeAmount(value);
      setOneTimeInput(String(value));
      return;
    }
    const next = Math.min(sipMaximum, Math.max(sipMinimum, value));
    setTotalAmount(next);
  };

  const toggleFund = (key: FundKey) => {
    const currentlySelected =
      key === "edelweiss" ? edelweiss : key === "gold" ? axisGold : axisSilver;

    if (currentlySelected) {
      adjustFund(key, -fundAmounts[key]);
      return;
    }

    adjustFund(key, 100);
  };

  const allocation = [
    { label: "Gold", amount: goldAmount, percent: goldPercent },
    { label: "Silver", amount: silverAmount, percent: silverPercent }
  ];

  return (
    <main className={dark ? "sip-page dark" : "sip-page"}>
      <div className="screenroot-label">SCREENROOT · PROTOTYPE TESTS</div>
      <button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? "☀" : "☾"}</button>

      <div className={amountError ? "phone invalid" : "phone"}>
        <header className="sip-header">
          <button className="back" aria-label="Back">←</button>
          <h1>{mode === "oneTime" ? "Investing in Sona-Chandi" : "Edit SIP details"}</h1>
          <button className="help" onClick={() => setSheet(true)} aria-label="Help">?</button>
        </header>

        <div className="tabs">
          <button className={mode === "sip" ? "tab active" : "tab"} onClick={() => setMode("sip")}>Setup SIP</button>
          <button className={mode === "oneTime" ? "tab active" : "tab"} onClick={() => setMode("oneTime")}>One-time</button>
        </div>

        <section className={riskProfile ? "risk-nudge has-profile" : "risk-nudge"}>
          <div className="risk-nudge-copy">
            <span>RISK PROFILE</span>
            <strong>{riskProfile ? `You’re ${riskProfile.name}` : "Know your investor profile?"}</strong>
            <p>{riskProfile ? "Use your profile as a guide while choosing how much to invest." : "Answer 7 quick questions to understand your risk preference."}</p>
          </div>
          <a href="/risk-profile">{riskProfile ? "View" : "Check now"}</a>
        </section>

        <section className="amount-section">
          {mode === "oneTime" && <div className="enter-label">Enter amount</div>}

          <div className="amount-control">
            <button
              onClick={() => mode === "oneTime"
                ? (() => { const next = Math.max(1000, oneTimeAmount - 1000); setOneTimeAmount(next); setOneTimeInput(String(next)); })()
                : (() => { const next = Math.max(sipMinimum, total - sipStep); setTotalAmount(next); })()}
              disabled={!!amountError || (mode === "oneTime" ? oneTimeAmount <= 1000 : baseAmount <= sipMinimum)}
            >−</button>

            {mode === "oneTime" ? (
              <input
                className="amount-input"
                type="text"
                inputMode="numeric"
                value={oneTimeInput === "" ? "" : formatAmount(oneTimeAmount)}
                onChange={e => { const raw = e.target.value.replace(/[^0-9]/g, ""); setOneTimeInput(raw); setOneTimeAmount(Math.min(300000, parseAmount(raw))); }}
                aria-label="One-time investment amount"
              />
            ) : (
              <input
                className="amount-input"
                type="text"
                inputMode="numeric"
                value={sipInput === "" ? "" : formatAmount(total)}
                onChange={e => { const raw = e.target.value.replace(/[^0-9]/g, ""); setSipInput(raw); setTotalAmount(Math.min(sipMaximum, parseAmount(raw))); }}
                aria-label="SIP amount"
              />
            )}

            <button
              onClick={() => mode === "oneTime"
                ? (() => { const next = Math.min(300000, oneTimeAmount + 1000); setOneTimeAmount(next); setOneTimeInput(String(next)); })()
                : (() => { const next = Math.min(sipMaximum, total + sipStep); setTotalAmount(next); })()}
              disabled={mode === "oneTime" ? oneTimeAmount >= 300000 : baseAmount >= sipMaximum}
            >+</button>
          </div>

          {amountError && <div className="amount-error">{amountError}</div>}

          <div className={amountError ? "presets inactive" : "presets"}>
            {(mode === "oneTime"
              ? [1000, 5000, 10000, 15000, 20000]
              : [sipMinimum, Math.min(sipMaximum, sipMinimum + sipStep), Math.min(sipMaximum, sipMinimum + sipStep * 2), Math.min(sipMaximum, sipMinimum + sipStep * 4), sipMaximum]
            ).map(value => (
              <button
                key={value}
                className={(mode === "oneTime" ? oneTimeAmount === value : baseAmount === value) ? "preset selected" : "preset"}
                onClick={() => setPreset(value)}
              >
                ₹{value.toLocaleString("en-IN")}
                {value === 1000 && mode === "oneTime" && <small>Min</small>}
                {mode === "sip" && value === sipMinimum && <small>Min</small>}
              </button>
            ))}
          </div>

          <input
            className={amountError ? "range inactive" : "range"}
            disabled={!!amountError}
            type="range"
            min={mode === "oneTime" ? 1000 : sipMinimum}
            max={mode === "oneTime" ? 300000 : sipMaximum}
            step={mode === "oneTime" ? 1000 : sipStep}
            value={mode === "oneTime" ? oneTimeAmount : total}
            style={{
              "--range-progress": `${((mode === "oneTime" ? oneTimeAmount - 1000 : total - sipMinimum) / ((mode === "oneTime" ? 300000 : sipMaximum) - (mode === "oneTime" ? 1000 : sipMinimum))) * 100}%`
            } as React.CSSProperties}
            onChange={e => mode === "oneTime"
              ? setOneTimeAmount(Number(e.target.value))
              : setTotalAmount(Number(e.target.value))}
            aria-label={mode === "oneTime" ? "One-time investment amount" : "SIP amount"}
          />

          <div className="range-labels">
            <span>₹{mode === "oneTime" ? "1,000" : sipMinimum.toLocaleString("en-IN")}</span>
            <span>₹{mode === "oneTime" ? "3,00,000" : sipMaximum.toLocaleString("en-IN")}</span>
          </div>

          {mode === "sip" && (
          <select
            disabled={!!amountError}
            className="frequency"
            value={frequency}
            onChange={e => {
              const nextFrequency = e.target.value;
              const nextMinimum = nextFrequency === "Daily" ? 100 : nextFrequency === "Weekly" ? 1000 : 5000;
              const nextMaximum = nextFrequency === "Daily" ? 2000 : nextFrequency === "Weekly" ? 20000 : 50000;
              setFrequency(nextFrequency);
              const nextAmount = Math.min(nextMaximum, Math.max(nextMinimum, selectedCount * 100));
              setBaseAmount(nextAmount);
              setSipInput(String(nextAmount));
            }}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          )}
        </section>

        {mode === "sip" && (
        <section className={amountError ? "payment-card inactive" : "payment-card"}>
          <div><span>First payment</span><strong>Today</strong></div>
          <div className="divider" />
          <div><span>Next payment on <i>i</i></span><strong>30th Jul</strong></div>
          <p>Your SIP (automatic investments) will be active until canceled. You can modify, pause, or cancel anytime.</p>
        </section>
        )}

        <button disabled={!!amountError} className={amountError ? "nav-card inactive" : "nav-card"} onClick={() => setSheet(true)}>
          <span>Purchase price (NAV) date: &nbsp;20 Aug, 2026</span>
          <i>i</i>
        </button>

        <section className={amountError ? "fund-list inactive" : "fund-list"}>
          <FundCard
            title="Gold + Silver"
            subtitle="Edelweiss · 50% Gold / 50% Silver"
            amount={fundAmounts.edelweiss}
            selected={edelweiss}
            onClick={() => toggleFund("edelweiss")}
            onMinus={() => adjustFund("edelweiss", -100)}
            onPlus={() => adjustFund("edelweiss", 100)}
          />
          <FundCard
            title="Gold"
            subtitle="HDFC Gold Fund"
            amount={fundAmounts.gold}
            selected={axisGold}
            onClick={() => toggleFund("gold")}
            onMinus={() => adjustFund("gold", -100)}
            onPlus={() => adjustFund("gold", 100)}
          />
          <FundCard
            title="Silver"
            subtitle="Nippon Silver Fund"
            amount={fundAmounts.silver}
            selected={axisSilver}
            onClick={() => toggleFund("silver")}
            onMinus={() => adjustFund("silver", -100)}
            onPlus={() => adjustFund("silver", 100)}
          />
        </section>>

        <div className={amountError ? "investing-pill inactive" : "investing-pill"} onClick={() => { if (!amountError) setSheet(true); }}>
          <span>Investing in</span>
          <button aria-label="View allocation">✳</button>
        </div>

        <footer>
          <button className="proceed" disabled={!!amountError || currentInput === ""} onClick={() => setSheet(true)}>{mode === "oneTime" ? "Continue" : "Proceed"}</button>
        </footer>

        {sheet && (
          <div className="overlay" onClick={() => setSheet(false)}>
            <section className="sheet" onClick={e => e.stopPropagation()}>
              <div className="handle" />
              <div className="detail-card">
                <div className="selected-funds">
                  {selected.map(item => (
                    <div className="provider" key={item.key}>
                      <span className={item.key === "edelweiss" ? "provider-icon blue" : "provider-icon"}>✳</span>
                      <span className="provider-name">{funds[item.key].provider}</span>
                    </div>
                  ))}
                </div>

                {(selected.length > 1 || edelweiss) && (
                  <div className="allocation-block">
                    {allocation.filter(item => item.amount > 0).map(item => (
                      <div className="allocation" key={item.label}>
                        <span>{item.label} - {item.percent.toFixed(2).replace(/\.00$/, "")}%</span>
                        <b>₹{formatAmount(item.amount)}{mode === "sip" ? `/${frequency.toLowerCase()}` : ""}</b>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="sheet-button" onClick={() => setSheet(false)}>
                Understood
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function FundCard({
  title,
  subtitle,
  amount,
  selected,
  onClick,
  onMinus,
  onPlus
}: {
  title: string;
  subtitle: string;
  amount: number;
  selected: boolean;
  onClick: () => void;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className={selected ? "fund-card selected-fund fund-card-editable" : "fund-card fund-card-editable"}>
      <button className="fund-select" onClick={onClick} aria-label={selected ? `Remove ${title}` : `Add ${title}`}>
        <span className="checkbox">{selected ? "✓" : ""}</span>
        <span className="fund-copy">
          <b>{title}</b>
          <span>{subtitle}</span>
        </span>
      </button>
      <div className="fund-amount-control">
        <button onClick={onMinus} disabled={amount <= 0} aria-label={`Decrease ${title}`}>−</button>
        <strong>₹{formatAmount(amount)}</strong>
        <button onClick={onPlus} aria-label={`Increase ${title}`}>+</button>
      </div>
    </div>
  );
}

<style jsx>{`
.risk-nudge {
  margin: 10px 16px 0;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #dedee5;
  border-radius: 12px;
  background: #f7f7fa;
}
.risk-nudge-copy span { display:block; font-size:8px; letter-spacing:.1em; font-weight:700; color:#777789; }
.risk-nudge-copy strong { display:block; margin-top:3px; font-size:12px; }
.risk-nudge-copy p { margin:3px 0 0; font-size:8px; color:#777789; line-height:1.3; }
.risk-nudge a { flex:0 0 auto; text-decoration:none; font-size:9px; font-weight:700; color:#4a4965; padding:7px 9px; border:1px solid #4a4965; border-radius:7px; }
.fund-card-editable { display:flex !important; align-items:center; gap:8px; }
.fund-select { flex:1; min-width:0; display:flex; align-items:center; gap:10px; border:0; background:transparent; padding:0; text-align:left; color:inherit; }
.fund-amount-control { display:flex; align-items:center; gap:4px; }
.fund-amount-control button { width:26px; height:26px; border:1px solid #dddde4; border-radius:6px; background:#fff; color:#4a4965; font-size:16px; line-height:1; }
.fund-amount-control button:disabled { opacity:.35; }
.fund-amount-control strong { min-width:44px; text-align:center; font-size:10px; }
`}</style>
