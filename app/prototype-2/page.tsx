"use client";

import "./styles.css";

import { useMemo, useState } from "react";

const investments = [
  {
    id: "edelweiss",
    name: "Edelweiss Gold and Silver ETF FoF",
    balance: 19500,
    units: 522.8,
    icon: "✳"
  },
  {
    id: "gold",
    name: "Axis Gold Fund",
    balance: 8760,
    units: 182.1234,
    icon: "▲"
  },
  {
    id: "silver",
    name: "Axis Silver Fund",
    balance: 8760,
    units: 182.1234,
    icon: "▲"
  }
] as const;

const percentages = [50, 75, 100];

export default function PrototypeTwo() {
  const [selectedId, setSelectedId] = useState("edelweiss");
  const selected = investments.find(item => item.id === selectedId) ?? investments[0];
  const [withdrawPercent, setWithdrawPercent] = useState(50);
  const [dark, setDark] = useState(false);
  const [manualAmount, setManualAmount] = useState(9750);

  const withdrawAmount = useMemo(
    () => Math.round(selected.balance * withdrawPercent / 100),
    [selected, withdrawPercent]
  );

  const displayedAmount = manualAmount;
  const manualPercent = Math.max(0, Math.min(100, (manualAmount / selected.balance) * 100));

  const selectInvestment = (id: string) => {
    setSelectedId(id);
    setWithdrawPercent(50);
    setManualAmount(Math.round(selected.balance * 0.5));
  };

  return (
    <main className={dark ? "withdraw-page dark" : "withdraw-page"}>
      <div className="screenroot-label">SCREENROOT · PROTOTYPE TESTS</div>
      <button className="withdraw-theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? "☀" : "☾"}</button>

      <div className="withdraw-phone">
        <header className="withdraw-header">
          <button className="withdraw-back" aria-label="Back">←</button>
          <h1>Withdraw</h1>
          <button className="withdraw-help" aria-label="Help">?</button>
        </header>

        <section className="investment-list">
          {investments.map(investment => {
            const active = investment.id === selected.id;
            return (
              <button
                key={investment.id}
                className={active ? "investment-card active" : "investment-card"}
                onClick={() => selectInvestment(investment.id)}
              >
                <span className={investment.id === "edelweiss" ? "fund-icon blue" : "fund-icon"}>{investment.icon}</span>
                <span className="investment-name">{investment.name}</span>
                <span className="investment-values">
                  <strong>₹{investment.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                  <span>{investment.units} Units</span>
                </span>
              </button>
            );
          })}
        </section>

        <section className="withdraw-controls">
          <p className="withdraw-label">I want to withdraw</p>

          <div className="withdraw-amount">
            <button onClick={() => { const next = Math.max(0, withdrawPercent - 5); setWithdrawPercent(next); setManualAmount(Math.round(selected.balance * next / 100)); }}>−</button>
            <input
              className="withdraw-amount-input"
              type="number"
              min="0"
              max={selected.balance}
              step="1"
              value={displayedAmount}
              onChange={e => {
                const amount = Math.max(0, Math.min(selected.balance, Number(e.target.value) || 0));
                setManualAmount(amount);
                setWithdrawPercent(Math.round((amount / selected.balance) * 100 / 5) * 5);
              }}
              aria-label="Manual withdrawal amount"
            />
            <button onClick={() => { const next = Math.min(100, withdrawPercent + 5); setWithdrawPercent(next); setManualAmount(Math.round(selected.balance * next / 100)); }}>+</button>
          </div>

          <div className="withdraw-presets">
            {percentages.map(percent => {
              const amount = Math.round(selected.balance * percent / 100);
              return (
                <button
                  key={percent}
                  className={withdrawPercent === percent ? "withdraw-preset selected" : "withdraw-preset"}
                  onClick={() => { setWithdrawPercent(percent); setManualAmount(amount); }}
                >
                  ₹{amount.toLocaleString("en-IN")} ({percent}%)
                </button>
              );
            })}
          </div>

          <input
            className="withdraw-range"
            type="range"
            min="0"
            max="100"
            step="5"
            value={withdrawPercent}
            style={{ "--withdraw-progress": `${withdrawPercent}%` } as React.CSSProperties}
            onChange={e => { const percent = Number(e.target.value); setWithdrawPercent(percent); setManualAmount(Math.round(selected.balance * percent / 100)); }}
            aria-label="Withdrawal percentage"
          />

          <div className="withdraw-range-labels">
            <span>₹100</span>
            <span>₹{selected.balance.toLocaleString("en-IN")}</span>
          </div>
        </section>

        <section className="withdraw-footer">
          <div className="tax-pill">Tax calculation &amp; exit fees <span>i</span></div>
          <p>Transferring to <span className="bank-icon">▲</span> <strong>AXIS Bank • 21756</strong></p>
          <button className="withdraw-button" onClick={() => alert(`Withdraw ₹${withdrawAmount.toLocaleString("en-IN")}`)}>
            Withdraw ₹{withdrawAmount.toLocaleString("en-IN")}
          </button>
        </section>
      </div>
    </main>
  );
}
