import React from "react";
import styles from "./FloatingCTA.module.css";

export default function FloatingCTA() {
  return (
    <div className={styles.floatingCTA}>
      <a href="#signup" className={styles.btn}>Get Early Access & 1 Month Free</a>
    </div>
  );
}
