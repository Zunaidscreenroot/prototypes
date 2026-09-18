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

export default function PrototypeOne() {
  const [edelweiss, setEdelweiss] = useState(true);
  const [axisGold, setAxisGold] = useState(false);
  const [axisSilver, setAxisSilver] = useState(false);
  const [baseAmount, setBaseAmount] = useState(100);
  const [frequency, setFrequency] = useState("Daily");
  const [sheet, setSheet] = useState(false);
  const [mode, setMode] = useState<"sip" | "oneTime">("sip");
  const [oneTimeAmount, setOneTimeAmount] = useState(45000);

  const selected = useMemo(() => {
    const keys: FundKey[] = [];
    if (edelweiss) keys.push("edelweiss");
    if (axisGold) keys.push("gold");
    if (axisSilver) keys.push("silver");

    if (mode === "oneTime") {
      const equalAmount = keys.length ? oneTimeAmount / keys.length : 0;
      return keys.map(key => ({ key, amount: equalAmount }));
    }

    return keys.map(key => ({
      key,
      amount: key === "edelweiss" ? baseAmount : 100
    }));
  }, [edelweiss, axisGold, axisSilver, baseAmount, mode, oneTimeAmount]);

  const total = mode === "oneTime"
    ? oneTimeAmount
    : selected.reduce((sum, item) => sum + item.amount, 0);

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
      return;
    }

    const minimumEdelweiss = edelweiss ? 100 : 0;
    const axisCount = Number(axisGold) + Number(axisSilver);
    const nextEdelweiss = Math.max(minimumEdelweiss, value - axisCount * 100);
    if (edelweiss) setBaseAmount(Math.max(100, nextEdelweiss));
    else if (value >= axisCount * 100) setBaseAmount(100);
  };

  const toggleFund = (key: FundKey) => {
    if (key === "edelweiss") setEdelweiss(v => !v);
    if (key === "gold") setAxisGold(v => !v);
    if (key === "silver") setAxisSilver(v => !v);
  };

  const allocation = [
    { label: "Gold", amount: goldAmount, percent: goldPercent },
    { label: "Silver", amount: silverAmount, percent: silverPercent }
  ];

  return (
    <main className="sip-page">
      <div className="screenroot-label">SCREENROOT · PROTOTYPE TESTS</div>

      <div className="phone">
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
                ? setOneTimeAmount(v => Math.max(1000, v - 1000))
                : setBaseAmount(v => Math.max(100, v - 100))}
              disabled={mode === "oneTime" ? oneTimeAmount <= 1000 : !edelweiss || baseAmount <= 100}
            >−</button>

            {mode === "oneTime" ? (
              <input
                className="amount-input"
                type="number"
                min="1000"
                max="300000"
                step="100"
                value={oneTimeAmount}
                onChange={e => setOneTimeAmount(Math.max(1000, Math.min(300000, Number(e.target.value) || 1000)))}
                aria-label="One-time investment amount"
              />
            ) : (
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            )}

            <button
              onClick={() => mode === "oneTime"
                ? setOneTimeAmount(v => Math.min(300000, v + 1000))
                : setBaseAmount(v => Math.min(3000, v + 100))}
              disabled={mode === "oneTime" ? oneTimeAmount >= 300000 : !edelweiss}
            >+</button>
          </div>

          <div className="presets">
            {(mode === "oneTime" ? [1000, 5000, 10000, 15000, 20000] : presets).map(value => (
              <button
                key={value}
                className={(mode === "oneTime" ? oneTimeAmount === value : baseAmount === value) ? "preset selected" : "preset"}
                onClick={() => setPreset(value)}
              >
                ₹{value.toLocaleString("en-IN")}
                {value === 1000 && mode === "oneTime" && <small>Min</small>}
                {value === 100 && mode === "sip" && <small>Min</small>}
              </button>
            ))}
          </div>

          <input
            className="range"
            type="range"
            min={mode === "oneTime" ? 1000 : 100}
            max={mode === "oneTime" ? 300000 : 3000}
            step={mode === "oneTime" ? 1000 : 100}
            value={mode === "oneTime" ? oneTimeAmount : baseAmount}
            onChange={e => mode === "oneTime"
              ? setOneTimeAmount(Number(e.target.value))
              : setBaseAmount(Number(e.target.value))}
            aria-label={mode === "oneTime" ? "One-time investment amount" : "SIP amount"}
          />

          <div className="range-labels">
            <span>₹{mode === "oneTime" ? "1,000" : "100"}</span>
            <span>₹{mode === "oneTime" ? "3,00,000" : "3,000"}</span>
          </div>

          {mode === "sip" && (
          <select
            className="frequency"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          )}
        </section>

        {mode === "sip" && (
        <section className="payment-card">
          <div><span>First payment</span><strong>Today</strong></div>
          <div className="divider" />
          <div><span>Next payment on <i>i</i></span><strong>30th Jul</strong></div>
          <p>Your SIP (automatic investments) will be active until canceled. You can modify, pause, or cancel anytime.</p>
        </section>
        )}

        <button className="nav-card" onClick={() => setSheet(true)}>
          <span>Purchase price (NAV) date: &nbsp;20 Aug, 2026</span>
          <i>i</i>
        </button>

        <section className="fund-list">
          <FundCard
            title="Gold+Silver"
            subtitle={edelweiss ? `Investing: ₹${(selected.find(x => x.key === "edelweiss")?.amount ?? 0).toFixed(2)}` : "Not investing in Gold+Silver"}
            selected={edelweiss}
            onClick={() => toggleFund("edelweiss")}
          />
          <FundCard
            title="Only Gold"
            subtitle={axisGold ? `Investing: ₹${(selected.find(x => x.key === "gold")?.amount ?? 0).toFixed(2)}` : "Not investing in only gold"}
            selected={axisGold}
            onClick={() => toggleFund("gold")}
          />
          <FundCard
            title="Only Silver"
            subtitle={axisSilver ? `Investing: ₹${(selected.find(x => x.key === "silver")?.amount ?? 0).toFixed(2)}` : "Not investing in only silver"}
            selected={axisSilver}
            onClick={() => toggleFund("silver")}
          />
        </section>

        <div className="investing-pill" onClick={() => setSheet(true)}>
          <span>Investing in</span>
          <button aria-label="View allocation">✳</button>
        </div>

        <footer>
          <button className="proceed" onClick={() => setSheet(true)}>{mode === "oneTime" ? "Continue" : "Proceed"}</button>
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
                        <b>₹{item.amount.toFixed(2)}/{mode === "oneTime" ? "one-time" : frequency.toLowerCase()}</b>
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
