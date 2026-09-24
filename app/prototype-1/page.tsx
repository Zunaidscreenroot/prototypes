"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const funds = {
  edelweiss: {
    title: "Edelweiss Gold + Silver FoF",
    provider: "Edelweiss Gold + Silver FoF",
    gold: 50,
    silver: 50,
    min: 100
  },
  gold: {
    title: "HDFC Gold Fund",
    provider: "HDFC Gold Fund",
    gold: 100,
    silver: 0,
    min: 50
  },
  silver: {
    title: "Nippon Silver Fund",
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
  const [fundAmounts, setFundAmounts] = useState({ edelweiss: 100, gold: 100, silver: 100 });
  const [baseAmount, setBaseAmount] = useState(300);
  const [riskProfile, setRiskProfile] = useState<{ name: string; tag: string; score: number; thought: string } | null>(null);
  const [frequency, setFrequency] = useState("Daily");
  const [sheet, setSheet] = useState(false);
  const [mode, setMode] = useState<"sip" | "oneTime">("sip");
  const [dark, setDark] = useState(false);
  const [oneTimeAmount, setOneTimeAmount] = useState(45000);
  const [oneTimeInput, setOneTimeInput] = useState("45000");
  const [sipInput, setSipInput] = useState("300");

  const selected = useMemo(
    () => (Object.keys(fundAmounts) as FundKey[])
      .filter(key => fundAmounts[key] > 0)
      .map(key => ({ key, amount: fundAmounts[key] })),
    [fundAmounts]
  );

  const frequencyMinimum = frequency === "Daily" ? 50 : frequency === "Weekly" ? 1000 : 5000;
  const frequencyMaximum = frequency === "Daily" ? 2000 : frequency === "Weekly" ? 20000 : 50000;
  const sipMinimum = frequencyMinimum;
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

  const distributeTotal = (value: number) => {
    const safeTotal = Math.min(sipMaximum, Math.max(frequencyMinimum, Math.round(value)));
    const next = { edelweiss: 0, gold: 0, silver: 0 };

    // Manual total entry accepts any whole-rupee amount.
    // Below ₹250, only combinations that satisfy each fund's minimum are used.
    if (safeTotal < 100) {
      next.gold = safeTotal;
    } else if (safeTotal < 150) {
      next.gold = safeTotal;
    } else if (safeTotal < 200) {
      next.edelweiss = 100;
      next.gold = safeTotal - 100;
    } else if (safeTotal < 250) {
      next.edelweiss = 100;
      next.gold = safeTotal - 100;
    } else {
      // At ₹250 all three can be active. From there, keep the allocation
      // as balanced as the individual minimums allow.
      const base = Math.floor(safeTotal / 3);
      next.edelweiss = Math.max(100, base);
      next.silver = Math.max(100, base);
      next.gold = safeTotal - next.edelweiss - next.silver;

      if (next.gold < 50) {
        const shortfall = 50 - next.gold;
        next.edelweiss = Math.max(100, next.edelweiss - Math.ceil(shortfall / 2));
        next.silver = safeTotal - next.edelweiss - 50;
        next.gold = 50;
      }
    }

    setFundAmounts(next);
    setBaseAmount(safeTotal);
    setSipInput(String(safeTotal));
  };
  const setTotalAmount = (value: number) => {
    distributeTotal(value);
  };

  const adjustFund = (key: FundKey, delta: number) => {
    const current = fundAmounts[key];
    const minimum = funds[key].min;
    let nextAmount = Math.max(0, current + delta);

    // A fund can only move between 0 and its configured minimum/valid increments.
    if (current === 0 && delta > 0) nextAmount = minimum;
    if (current > 0 && nextAmount > 0 && nextAmount < minimum) nextAmount = minimum;

    setFundAmounts(prev => ({ ...prev, [key]: nextAmount }));

    const nextAmounts = { ...fundAmounts, [key]: nextAmount };
    const nextTotal = Object.values(nextAmounts).reduce((sum, amount) => sum + amount, 0);
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
          <a href={riskProfile ? "/risk-profile/details" : "/risk-profile"}>{riskProfile ? "View" : "Check now"}</a>
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
            } as CSSProperties}
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
              const nextAmount = Math.min(nextMaximum, Math.max(nextMinimum, total));
              distributeTotal(nextAmount);
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
            title={funds.edelweiss.title}
            subtitle=""
            amount={fundAmounts.edelweiss}
            minimum={funds.edelweiss.min}
            onMinus={() => adjustFund("edelweiss", -1)}
            onPlus={() => adjustFund("edelweiss", 1)}
            onAmountChange={value => adjustFund("edelweiss", value - fundAmounts.edelweiss)}
          />
          <FundCard
            title={funds.gold.title}
            subtitle=""
            amount={fundAmounts.gold}
            minimum={funds.gold.min}
            onMinus={() => adjustFund("gold", -1)}
            onPlus={() => adjustFund("gold", 1)}
            onAmountChange={value => adjustFund("gold", value - fundAmounts.gold)}
          />
          <FundCard
            title={funds.silver.title}
            subtitle=""
            amount={fundAmounts.silver}
            minimum={funds.silver.min}
            onMinus={() => adjustFund("silver", -1)}
            onPlus={() => adjustFund("silver", 1)}
            onAmountChange={value => adjustFund("silver", value - fundAmounts.silver)}
          />
        </section>

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

                {(selected.length > 1 || selected.some(item => item.key === "edelweiss")) && (
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
  minimum,
  onMinus,
  onPlus,
  onAmountChange
}: {
  title: string;
  subtitle: string;
  amount: number;
  minimum: number;
  onMinus: () => void;
  onPlus: () => void;
  onAmountChange: (value: number) => void;
}) {
  const selected = amount > 0;
  const invalid = selected && amount < minimum;

  return (
    <div className={selected ? "fund-card selected-fund fund-card-editable" : "fund-card fund-card-editable"}>
      <div className="fund-copy">
        <b>{title}</b>
        {subtitle && <span>{subtitle}</span>}
        {invalid && <small className="fund-min-error">Min ₹{formatAmount(minimum)}</small>}
      </div>
      <div className="fund-amount-control">
        <button
          onClick={onMinus}
          disabled={amount === 0}
          aria-label={amount <= minimum ? `Remove ${title}` : `Decrease ${title}`}
        >−</button>
        <input
          className="fund-amount-input"
          type="text"
          inputMode="numeric"
          value={amount === 0 ? "" : String(amount)}
          placeholder="0"
          onChange={e => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            onAmountChange(raw === "" ? 0 : Number(raw));
          }}
          aria-label={`${title} amount`}
        />
        <button onClick={onPlus} aria-label={`Increase ${title}`}>+</button>
      </div>
    </div>
  );
}
