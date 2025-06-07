import React from "react";
import styles from "./MockupDemo.module.css";

export default function MockupDemo() {
  return (
    <div className={styles.mockupHero}>
      <img
        src="https://raw.githubusercontent.com/nsaw/imageSrc/3442fe5002ba3f450632b28afe926d711b3aece1/IMG_6129.jpeg"
        alt="App mockup"
      />
    </div>
  );
}
