import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroVariant {
  headline: string[];
  subhead: string;
}

const heroVariants: HeroVariant[] = [
  {
    headline: ["Capture at the speed of life.", "Find at the speed of need."],
    subhead: "Thought it and forgot it? Found it.",
  },
  {
    headline: ["Don't watch another shower thought", "circle the drain."],
    subhead: "Capture at the speed of life. Find it when you need it.",
  },
  {
    headline: ["The notes app for people", "with great ideas and average memory."],
    subhead: "Life’s moving. Your notes should keep up.",
  },
  {
    headline: ["Your brain's tired", "your ideas shouldn't be."],
    subhead: "Your ideas deserve better than your notes app.",
  },
  {
    headline: ["Tip-of-the-tongue, solved."],
    subhead: "For people with a million ideas and zero attention span.",
  },
];

export default function HeroCycler() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroVariants.length);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const current = heroVariants[currentIndex];

  return (
    <div className="space-y-6" aria-live="polite" aria-atomic="true">
      {/* Headline */}
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight"
        >
          {current.headline.map((line, i) => (
            <span key={i}>
              {i === current.headline.length - 1 ? (
                <span className="text-accent font-bold">{line}</span>
              ) : (
                <>{line}<br /></>
              )}
            </span>
          ))}
        </motion.h1>
      </AnimatePresence>

      {/* Subhead */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-xl sm:text-2xl text-zinc-300 max-w-xl leading-relaxed"
        >
          {current.subhead}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots - 44x44px touch targets per WCAG 2.5.5 */}
      <div className="flex gap-1 pt-2" role="tablist" aria-label="Headline selector">
        {heroVariants.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`View headline ${i + 1} of ${heroVariants.length}`}
            className={`w-11 h-11 flex items-center justify-center rounded-full 
                       transition-all duration-300 focus-visible:outline-none 
                       focus-visible:ring-2 focus-visible:ring-accent`}
          >
            <span 
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-accent w-6 h-2' 
                  : 'bg-zinc-700 hover:bg-zinc-600 w-2 h-2'
              }`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

