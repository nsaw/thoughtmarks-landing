import React from "react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    quote: "As a sculptor, I capture ideas when inspiration hits—even at 2am. Thoughtmarks is my creative net.",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    name: "Maya T.",
    role: "Artist, 34",
  },
  {
    quote: "My brain moves fast. Thoughtmarks keeps me on track, even when I’m elbows-deep in walnut shavings.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    name: "Ben S.",
    role: "Custom Furniture Maker, 42",
  },
  {
    quote: "Finally, a place where voice notes don’t disappear. Thoughtmarks sorts my chaos—so I don’t have to.",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    name: "Dana M.",
    role: "Startup Founder, 29",
  },
  {
    quote: "I build apps for a living. Now my ideas don’t slip between commits.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Alex R.",
    role: "Developer, 38",
  },
];

export default function Testimonials() {
  return (
    <>
      <div id="testimonials" className={styles.sectionTitle}>What People Are Saying</div>
      <div className={styles.testimonialsRow}>
        {testimonials.map((t, i) => (
          <div className={styles.testimonialCard} key={i}>
            <div className={styles.quote}>“{t.quote}”</div>
            <div className={styles.person}>
              <img className={styles.avatar} src={t.avatar} alt={`${t.name} avatar`} />
              <div className={styles.info}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
