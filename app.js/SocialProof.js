import React from "react";
import styles from "./SocialProof.module.css";

export default function SocialProof() {
  return (
    <div className={styles.socialProof}>
      <div className={styles.promo}>Featured in</div>
      <div className={styles.logos}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Product_Hunt_logo.png" alt="Product Hunt"/>
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Indie_Hackers_logo.png" alt="Indie Hackers"/>
        <img src="https://cdn.worldvectorlogo.com/logos/beta-list-1.svg" alt="BetaList"/>
      </div>
    </div>
  );
}
