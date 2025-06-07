import React, { useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MockupDemo from "./components/MockupDemo";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import SocialProof from "./components/SocialProof";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";

function App() {
  const handleEmailSubmit = useCallback((e) => {
    e.preventDefault();
    alert("Thanks for signing up! (Wire this up to Mailchimp or your backend.)");
  }, []);
  return (
    <>
      <Navbar />
      <div className="container">
        <Hero onSubmit={handleEmailSubmit} />
        <MockupDemo />
        <Features />
        <HowItWorks />
        <Testimonials />
        <SocialProof />
        <Footer />
      </div>
      <FloatingCTA />
    </>
  );
}
export default App;
