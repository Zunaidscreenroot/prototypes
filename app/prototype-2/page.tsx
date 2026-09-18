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
const MIN_WITHDRAWAL = 100;

const formatAmount = (value: number) => value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const parseAmount = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;

export default function PrototypeTwo() {
  const [selectedId, setSelectedId] = useState("edelweiss");
  const selected = investments.find(item => item.id === selectedId) ?? investments[0];
  const [withdrawPercent, setWithdrawPercent] = useState(50);
  const [dark, setDark] = useState(false);
  const [manualAmount, setManualAmount] = useState(9750);
  const [manualInput, setManualInput] = useState("9750");

  const withdrawAmount = useMemo(
    () => Math.round(selected.balance * withdrawPercent / 100),
    [selected, withdrawPercent]
  );

  const displayedAmount = manualInput === "" ? "" : formatAmount(manualAmount);
  const withdrawalError = manualInput === "" || manualAmount < MIN_WITHDRAWAL
    ? `Minimum withdrawal is ₹${formatAmount(MIN_WITHDRAWAL)}`
    : "";

  const selectInvestment = (id: string) => {
    setSelectedId(id);
    setWithdrawPercent(50);
    const nextInvestment = investments.find(item => item.id === id) ?? investments[0];
    const nextAmount = Math.round(nextInvestment.balance * 0.5);
    setManualAmount(nextAmount);
    setManualInput(String(nextAmount));
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
                  <strong>₹{formatAmount(investment.balance)}</strong>
                  <span>{investment.units} Units</span>
                </span>
              </button>
            );
          })}
        </section>

        <section className="withdraw-controls">
          <p className="withdraw-label">I want to withdraw</p>

          <div className="withdraw-amount">
            <button onClick={() => { const next = Math.max(MIN_WITHDRAWAL, manualAmount - 100); setManualAmount(next); setManualInput(String(next)); setWithdrawPercent((next / selected.balance) * 100); }}>−</button>
            <input
              className="withdraw-amount-input"
              type="text"
              inputMode="numeric"
              value={displayedAmount}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                const amount = Math.min(selected.balance, parseAmount(raw));
                setManualInput(raw);
                setManualAmount(amount);
                setWithdrawPercent((amount / selected.balance) * 100);
              }}
              aria-label="Manual withdrawal amount"
            />
            <button onClick={() => { const next = Math.min(selected.balance, manualAmount + 100); setManualAmount(next); setManualInput(String(next)); setWithdrawPercent((next / selected.balance) * 100); }}>+</button>
          </div>

          {withdrawalError && <div className="withdraw-error">{withdrawalError}</div>}

          <div className="withdraw-presets">
            {percentages.map(percent => {
              const amount = Math.round(selected.balance * percent / 100);
              return (
                <button
                  key={percent}
                  className={withdrawPercent === percent ? "withdraw-preset selected" : "withdraw-preset"}
                  onClick={() => { setWithdrawPercent(percent); setManualAmount(amount); setManualInput(String(amount)); }}
                >
                  ₹{formatAmount(amount)} ({percent}%)
                </button>
              );
            })}
          </div>

          <input
            className="withdraw-range"
            type="range"
            min={MIN_WITHDRAWAL}
            max={selected.balance}
            step="100"
            value={manualAmount}
            style={{ "--withdraw-progress": (manualAmount / selected.balance * 100) + "%" } as React.CSSProperties}
            onChange={e => {
              const amount = Math.min(selected.balance, Number(e.target.value));
              setManualAmount(amount);
              setWithdrawPercent((amount / selected.balance) * 100);
            }}
            aria-label="Withdrawal percentage"
          />

          <div className="withdraw-range-labels">
            <span>₹{MIN_WITHDRAWAL}</span>
            <span>₹{formatAmount(selected.balance)}</span>
          </div>
        </section>

        <section className="withdraw-footer">
          <div className="tax-pill">Tax calculation &amp; exit fees <span>i</span></div>
          <p>Transferring to <span className="bank-icon">▲</span> <strong>AXIS Bank • 21756</strong></p>
          <button className="withdraw-button" disabled={!!withdrawalError}
            onClick={() => alert(`Withdraw ₹${formatAmount(manualAmount)}`)}>
            Withdraw ₹{formatAmount(manualAmount)}
          </button>
        </section>
      </div>
    </main>
  );
}
