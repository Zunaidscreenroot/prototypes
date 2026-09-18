"use client";

import { useMemo, useState } from "react";

const funds = {
  goldSilver: {
    title: "Gold+Silver",
    provider: "Edelweiss Gold and Silver ETF Fund of Funds",
    split: [{ label: "Gold", percent: 60 }, { label: "Silver", percent: 40 }]
  },
  gold: {
    title: "Only Gold",
    provider: "Axis Gold Fund",
    split: [{ label: "Gold", percent: 100 }]
  },
  silver: {
    title: "Only Silver",
    provider: "Axis Silver Fund",
    split: [{ label: "Silver", percent: 100 }]
  }
} as const;

type FundKey = keyof typeof funds;

export default function PrototypeOne() {
  const [amount, setAmount] = useState(100);
  const [fund, setFund] = useState<FundKey>("goldSilver");
  const [frequency, setFrequency] = useState("Daily");
  const [sheet, setSheet] = useState<"fund" | "proceed" | null>(null);
  const selected = funds[fund];

  const allocation = useMemo(
    () => selected.split.map(x => ({ ...x, amount: Math.round(amount * x.percent / 100) })),
    [amount, selected]
  );

  const changeAmount = (delta: number) =>
    setAmount(v => Math.min(3000, Math.max(100, v + delta)));

  return (
    <main className="sip-page"><div className="screenroot-label">SCREENROOT · PROTOTYPE TESTS</div>
      <div className="phone">
        <header className="sip-header">
          <button className="back" aria-label="Back">←</button>
          <h1>Edit SIP details</h1>
          <button className="help" onClick={() => setSheet("fund")} aria-label="Help">?</button>
        </header>

        <div className="tabs">
          <button className="tab active">Setup SIP</button>
          <button className="tab">One-time</button>
        </div>

        <section className="amount-section">
          <div className="amount-control">
            <button onClick={() => changeAmount(-100)}>−</button>
            <strong>₹{amount.toLocaleString("en-IN")}</strong>
            <button onClick={() => changeAmount(100)}>+</button>
          </div>

          <div className="presets">
            {[100,200,300,500,1000].map(v => (
              <button key={v} className={amount === v ? "preset selected" : "preset"} onClick={() => setAmount(v)}>
                ₹{v.toLocaleString("en-IN")}{v === 100 && <small>Min</small>}
              </button>
            ))}
          </div>

          <input className="range" type="range" min="100" max="3000" step="100" value={amount}
            onChange={e => setAmount(Number(e.target.value))} />
          <div className="range-labels"><span>₹100</span><span>₹3,000</span></div>

          <select className="frequency" value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option>Daily</option><option>Weekly</option><option>Monthly</option>
          </select>
        </section>

        <section className="payment-card">
          <div><span>First payment</span><strong>Today</strong></div>
          <div className="divider" />
          <div><span>Next payment on <i>i</i></span><strong>30th Jul</strong></div>
          <p>Your SIP (automatic investments) will be active until canceled. You can modify, pause, or cancel anytime.</p>
        </section>

        <button className="nav-card" onClick={() => setSheet("fund")}>
          <span>Purchase price (NAV) date: &nbsp;20 Aug, 2026</span><i>i</i>
        </button>

        <section className="fund-list">
          {(Object.keys(funds) as FundKey[]).map(key => {
            const item = funds[key];
            const active = fund === key;
            return (
              <button key={key} className={active ? "fund-card active-fund" : "fund-card"} onClick={() => setFund(key)}>
                <span className="checkbox">{active ? "✓" : ""}</span>
                <span className="fund-copy">
                  <b>{item.title}</b>
                  <span>{key === "goldSilver" ? `Investing: ₹${amount.toFixed(2)}` : `Not investing in only ${key}`}</span>
                </span>
              </button>
            );
          })}
        </section>

        <div className="investing-pill">
          <span>Investing in</span>
          <button onClick={() => setSheet("fund")}>✳</button>
        </div>

        <footer><button className="proceed" onClick={() => setSheet("proceed")}>Proceed</button></footer>

        {sheet && (
          <div className="overlay" onClick={() => setSheet(null)}>
            <section className="sheet" onClick={e => e.stopPropagation()}>
              <div className="handle" />
              {sheet === "fund" ? (
                <>
                  <div className="detail-card">
                    <div className="provider"><span>✳</span>{selected.provider}</div>
                    {allocation.map(x => (
                      <div className="allocation" key={x.label}>
                        <span>{x.label} - {x.percent}%</span><b>₹{x.amount}/{frequency.toLowerCase()}</b>
                      </div>
                    ))}
                  </div>
                  <button className="sheet-button" onClick={() => setSheet(null)}>Understood</button>
                </>
              ) : (
                <>
                  <div className="confirmation">
                    <small>SIP SUMMARY</small>
                    <h2>Ready to proceed?</h2>
                    <p>₹{amount.toLocaleString("en-IN")} {frequency.toLowerCase()} SIP in {selected.title}.</p>
                    {allocation.map(x => <div className="summary" key={x.label}><span>{x.label}</span><b>₹{x.amount}/{frequency.toLowerCase()}</b></div>)}
                  </div>
                  <button className="sheet-button" onClick={() => setSheet(null)}>Confirm prototype</button>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}