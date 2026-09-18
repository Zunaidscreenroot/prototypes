"use client";

import { useMemo, useState } from "react";

const funds = {
  edelweiss: {
    title: "Gold+Silver",
    provider: "Edelweiss Gold and Silver ETF Fund of Funds",
    gold: 60,
    silver: 40,
    min: 100
  },
  gold: {
    title: "Only Gold",
    provider: "Axis Gold Fund",
    gold: 100,
    silver: 0,
    min: 100
  },
  silver: {
    title: "Only Silver",
    provider: "Axis Silver Fund",
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
  const [axisGold, setAxisGold] = useState(false);
  const [axisSilver, setAxisSilver] = useState(false);
  const [baseAmount, setBaseAmount] = useState(100);
  const [frequency, setFrequency] = useState("Daily");
  const [sheet, setSheet] = useState(false);
  const [mode, setMode] = useState<"sip" | "oneTime">("sip");
  const [dark, setDark] = useState(false);
  const [oneTimeAmount, setOneTimeAmount] = useState(45000);
  const [oneTimeInput, setOneTimeInput] = useState("45000");
  const [sipInput, setSipInput] = useState("100");

  const selected = useMemo(() => {
    const keys: FundKey[] = [];
    if (edelweiss) keys.push("edelweiss");
    if (axisGold) keys.push("gold");
    if (axisSilver) keys.push("silver");

    const investmentTotal = mode === "oneTime" ? oneTimeAmount : baseAmount;
    const equalAmount = keys.length ? investmentTotal / keys.length : 0;
    return keys.map(key => ({ key, amount: equalAmount }));
  }, [edelweiss, axisGold, axisSilver, baseAmount, mode, oneTimeAmount]);

  const selectedCount = Number(edelweiss) + Number(axisGold) + Number(axisSilver);
  const frequencyMinimum = frequency === "Daily" ? 100 : frequency === "Weekly" ? 1000 : 5000;
  const frequencyMaximum = frequency === "Daily" ? 2000 : frequency === "Weekly" ? 20000 : 50000;
  const sipMinimum = Math.max(frequencyMinimum, selectedCount * 100);
  const sipMaximum = frequencyMaximum;
  const sipStep = frequency === "Daily" ? 100 : frequency === "Weekly" ? 1000 : 5000;
  const total = mode === "oneTime"
    ? oneTimeAmount
    : baseAmount;
  const minimumAmount = mode === "oneTime" ? 1000 : sipMinimum;
  const currentInput = mode === "oneTime" ? oneTimeInput : sipInput;
  const currentInputAmount = parseAmount(currentInput);
  const amountError = currentInput !== "" && currentInputAmount < minimumAmount
    ? `Minimum amount is ₹${formatAmount(minimumAmount)}`
    : currentInput === ""
      ? `Minimum amount is ₹${formatAmount(minimumAmount)}`
      : "";

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
    setBaseAmount(next);
    setSipInput(String(next));
  };

  const toggleFund = (key: FundKey) => {
    const nextEdelweiss = key === "edelweiss" ? !edelweiss : edelweiss;
    const nextAxisGold = key === "gold" ? !axisGold : axisGold;
    const nextAxisSilver = key === "silver" ? !axisSilver : axisSilver;
    const nextCount = Number(nextEdelweiss) + Number(nextAxisGold) + Number(nextAxisSilver);

    if (mode === "sip") {
      const nextAmount = Math.min(sipMaximum, Math.max(baseAmount, nextCount * 100));
      setBaseAmount(nextAmount);
      setSipInput(String(nextAmount));
    }

    setEdelweiss(nextEdelweiss);
    setAxisGold(nextAxisGold);
    setAxisSilver(nextAxisSilver);
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

        <section className="amount-section">
          {mode === "oneTime" && <div className="enter-label">Enter amount</div>}

          <div className="amount-control">
            <button
              onClick={() => mode === "oneTime"
                ? (() => { const next = Math.max(1000, oneTimeAmount - 1000); setOneTimeAmount(next); setOneTimeInput(String(next)); })()
                : (() => { const next = Math.max(sipMinimum, baseAmount - sipStep); setBaseAmount(next); setSipInput(String(next)); })()}
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
                value={sipInput === "" ? "" : formatAmount(baseAmount)}
                onChange={e => { const raw = e.target.value.replace(/[^0-9]/g, ""); setSipInput(raw); setBaseAmount(Math.min(sipMaximum, parseAmount(raw))); }}
                aria-label="SIP amount"
              />
            )}

            <button
              onClick={() => mode === "oneTime"
                ? (() => { const next = Math.min(300000, oneTimeAmount + 1000); setOneTimeAmount(next); setOneTimeInput(String(next)); })()
                : (() => { const next = Math.min(sipMaximum, baseAmount + sipStep); setBaseAmount(next); setSipInput(String(next)); })()}
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
            value={mode === "oneTime" ? oneTimeAmount : baseAmount}
            style={{
              "--range-progress": `${((mode === "oneTime" ? oneTimeAmount - 1000 : baseAmount - sipMinimum) / ((mode === "oneTime" ? 300000 : sipMaximum) - (mode === "oneTime" ? 1000 : sipMinimum))) * 100}%`
            } as React.CSSProperties}
            onChange={e => mode === "oneTime"
              ? setOneTimeAmount(Number(e.target.value))
              : setBaseAmount(Number(e.target.value))}
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
            title="Gold+Silver"
            subtitle={edelweiss ? `Investing: ₹${formatAmount(selected.find(x => x.key === "edelweiss")?.amount ?? 0)}` : "Not investing in Gold+Silver"}
            selected={edelweiss}
            onClick={() => toggleFund("edelweiss")}
          />
          <FundCard
            title="Only Gold"
            subtitle={axisGold ? `Investing: ₹${formatAmount(selected.find(x => x.key === "gold")?.amount ?? 0)}` : "Not investing in only gold"}
            selected={axisGold}
            onClick={() => toggleFund("gold")}
          />
          <FundCard
            title="Only Silver"
            subtitle={axisSilver ? `Investing: ₹${formatAmount(selected.find(x => x.key === "silver")?.amount ?? 0)}` : "Not investing in only silver"}
            selected={axisSilver}
            onClick={() => toggleFund("silver")}
          />
        </section>

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
  selected,
  onClick
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button className={selected ? "fund-card selected-fund" : "fund-card"} onClick={onClick}>
      <span className="checkbox">{selected ? "✓" : ""}</span>
      <span className="fund-copy">
        <b>{title}</b>
        <span>{subtitle}</span>
      </span>
    </button>
  );
}
