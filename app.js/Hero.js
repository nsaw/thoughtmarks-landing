import React from "react";
import styles from "./Hero.module.css";

export default function Hero({ onSubmit }) {
  return (
    <section className={styles.hero} id="signup">
      <div className={styles.headline}>
        Find <span className={styles.focus}>FOCUS</span> in the <span className={styles.chaos}>CHAOS</span>
      </div>
      <div className={styles.tagline}>bookmarks for your brain</div>
      <div className={styles.desc}>
        Stay focused, never forget anything, and let AI organize your best ideas—automatically.
      </div>
      <div className={styles.promo}>Get Early Access & 1 Month of Thoughtmarks Premium free</div>
      <form className={styles.capture} onSubmit={onSubmit}>
        <input type="email" required placeholder="Your email address" />
        <button type="submit">Join the Waitlist</button>
      </form>
    </section>
  );
}
