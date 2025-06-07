import React, { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img
          src="https://raw.githubusercontent.com/nsaw/imageSrc/3442fe5002ba3f450632b28afe926d711b3aece1/IMG_4663.jpeg"
          alt="Thoughtmarks Logo"
          className={styles.logo}
        />
        <span className={styles.title}>Thoughtmarks</span>
      </div>
      <button
        className={`${styles.hamburger} ${open ? styles.active : ""}`}
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        className={styles.links}
        style={{ display: open ? "flex" : "none" }}
      >
        <a href="#features" onClick={handleLinkClick}>Features</a>
        <a href="#how" onClick={handleLinkClick}>How it Works</a>
        <a href="#testimonials" onClick={handleLinkClick}>Testimonials</a>
        <a href="#signup" onClick={handleLinkClick}>Sign Up</a>
      </div>
    </nav>
  );
}
