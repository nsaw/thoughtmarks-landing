import React from "react";
import styles from "./Features.module.css";

const features = [
  {
    icon: "🧠",
    title: "AI Integration",
    desc: "Your ideas auto-organize and connect. Recall anything, anytime, even by voice.",
  },
  {
    icon: "🔒",
    title: "Stay Focused",
    desc: "No more distractions or lost thoughts. Capture without breaking your flow.",
  },
  {
    icon: "🗂️",
    title: "Don’t Forget a Thing",
    desc: "All your notes, quotes, and flashes of genius are always searchable and safe.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Available on web, mobile, and soon: watch, desktop, and every device you think on.",
  },
];

export default function Features() {
  return (
    <div id="features" className={styles.featuresRow}>
      {features.map((f, i) => (
        <div className={styles.card} key={i}>
          <span className={styles.icon}>{f.icon}</span>
          <div className={styles.title}>{f.title}</div>
          <div className={styles.desc}>{f.desc}</div>
        </div>
      ))}
    </div>
  );
}
