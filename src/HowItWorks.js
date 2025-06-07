import React from "react";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    emoji: "🎤",
    step: "1. Capture",
    desc: "Instantly save a thought—voice, text, or quick tap.",
  },
  {
    emoji: "🤖",
    step: "2. Organize",
    desc: "AI sorts and tags your ideas, so you don’t have to.",
  },
  {
    emoji: "⚡",
    step: "3. Find",
    desc: "Recall, review, and connect ideas when it matters.",
  },
];

export default function HowItWorks() {
  return (
    <>
      <div id="how" className={styles.sectionTitle}>How It Works</div>
      <div className={styles.howWorksRow}>
        {steps.map((s, i) => (
          <div className={styles.howCard} key={i}>
            <span className={styles.emoji}>{s.emoji}</span>
            <strong>{s.step}</strong>
            {s.desc}
          </div>
        ))}
      </div>
    </>
  );
}
