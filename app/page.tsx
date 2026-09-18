"use client";

import { useState } from "react";

const prototypes = [
  {
    name: "Interaction Sandbox",
    description: "A starting point for testing flows, interactions, states and edge cases.",
    status: "Ready"
  },
  {
    name: "Client Demo",
    description: "A clean space for presenting a prototype to stakeholders.",
    status: "Template"
  }
];

export default function Home() {
  const [selected, setSelected] = useState(0);

  return (
    <main className="shell">
      <header className="header">
        <div>
          <p className="eyebrow">PROTOTYPE LAB</p>
          <h1>Functional prototypes, without the overhead.</h1>
          <p className="intro">
            Build quick Next.js prototypes here to validate functionality, test
            interactions and share client-ready demos.
          </p>
        </div>
        <div className="badge">Next.js</div>
      </header>

      <section className="workspace">
        <aside className="sidebar" aria-label="Prototype list">
          <div className="sidebar-title">Prototypes</div>
          {prototypes.map((prototype, index) => (
            <button
              key={prototype.name}
              className={`prototype-item ${selected === index ? "active" : ""}`}
              onClick={() => setSelected(index)}
            >
              <span>{prototype.name}</span>
              <small>{prototype.status}</small>
            </button>
          ))}
        </aside>

        <section className="canvas">
          <div className="canvas-top">
            <div>
              <span className="label">CURRENT PROTOTYPE</span>
              <h2>{prototypes[selected].name}</h2>
            </div>
            <span className="live">● Local interaction</span>
          </div>

          <div className="demo-card">
            <span className="demo-number">01</span>
            <h3>Start building</h3>
            <p>
              Add new prototype routes under <code>app/</code>. Keep each
              prototype focused on a single functionality or user flow.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => alert("Prototype action works!")}>
                Test interaction
              </button>
              <button className="secondary" onClick={() => setSelected((selected + 1) % prototypes.length)}>
                Next prototype
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}