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

  const selected = useMemo(() => {
    const list: { key: FundKey; amount: number }[] = [];
    if (edelweiss) list.push({ key: "edelweiss", amount: baseAmount });
    if (axisGold) list.push({ key: "gold", amount: 100 });
    if (axisSilver) list.push({ key: "silver", amount: 100 });
    return list;
  }, [edelweiss, axisGold, axisSilver, baseAmount]);

  const total = selected.reduce((sum, item) => sum + item.amount, 0);

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
    setBaseAmount(value);
    setEdelweiss(true);
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
          <h1>Edit SIP details</h1>
          <button className="help" onClick={() => setSheet(true)} aria-label="Help">?</button>
        </header>

        <div className="tabs">
          <button className="tab active">Setup SIP</button>
          <button className="tab">One-time</button>
        </div>

        <section className="amount-section">
          <div className="amount-control">
            <button onClick={() => setBaseAmount(v => Math.max(100, v - 100))}>−</button>
            <strong>₹{baseAmount.toLocaleString("en-IN")}</strong>
            <button onClick={() => setBaseAmount(v => Math.min(3000, v + 100))}>+</button>
          </div>

          <div className="presets">
            {presets.map(value => (
              <button
                key={value}
                className={baseAmount === value ? "preset selected" : "preset"}
                onClick={() => setPreset(value)}
              >
                ₹{value.toLocaleString("en-IN")}
                {value === 100 && <small>Min</small>}
              </button>
            ))}
          </div>

          <input
            className="range"
            type="range"
            min="100"
            max="3000"
            step="100"
            value={baseAmount}
            onChange={e => setBaseAmount(Number(e.target.value))}
            aria-label="SIP amount"
          />

          <div className="range-labels">
            <span>₹100</span>
            <span>₹3,000</span>
          </div>

          <select
            className="frequency"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </section>

        <section className="payment-card">
          <div><span>First payment</span><strong>Today</strong></div>
          <div className="divider" />
          <div><span>Next payment on <i>i</i></span><strong>30th Jul</strong></div>
          <p>Your SIP (automatic investments) will be active until canceled. You can modify, pause, or cancel anytime.</p>
        </section>

        <button className="nav-card" onClick={() => setSheet(true)}>
          <span>Purchase price (NAV) date: &nbsp;20 Aug, 2026</span>
          <i>i</i>
        </button>

        <section className="fund-list">
          <FundCard
            title="Gold+Silver"
            subtitle={`Investing: ₹${baseAmount.toFixed(2)}`}
            selected={edelweiss}
            onClick={() => toggleFund("edelweiss")}
          />
          <FundCard
            title="Only Gold"
            subtitle={axisGold ? "Investing: ₹100.00" : "Not investing in only gold"}
            selected={axisGold}
            onClick={() => toggleFund("gold")}
          />
          <FundCard
            title="Only Silver"
            subtitle={axisSilver ? "Investing: ₹100.00" : "Not investing in only silver"}
            selected={axisSilver}
            onClick={() => toggleFund("silver")}
          />
        </section>

        <div className="investing-pill" onClick={() => setSheet(true)}>
          <span>Investing in</span>
          <button aria-label="View allocation">✳</button>
        </div>

        <footer>
          <button className="proceed" onClick={() => setSheet(true)}>Proceed</button>
        </footer>

        {sheet && (
          <div className="overlay" onClick={() => setSheet(false)}>
            <section className="sheet" onClick={e => e.stopPropagation()}>
              <div className="handle" />
              <div className="detail-card">
                <div className="provider">
                  <span>✳</span>
                  <span className="provider-name">
                    {selected.length === 1
                      ? funds[selected[0].key].provider
                      : "Your selected investment funds"}
                  </span>
                </div>

                {allocation.map(item => (
                  <div className="allocation" key={item.label}>
                    <span>{item.label} - {item.percent.toFixed(2).replace(/\.00$/, "")}%</span>
                    <b>₹{item.amount.toFixed(2)}/{frequency.toLowerCase()}</b>
                  </div>
                ))}
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
