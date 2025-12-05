// src/components/react/StickyCTA.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaitlistModal from './WaitlistModal';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it this session
    const dismissed = sessionStorage.getItem('sticky_cta_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling past hero (roughly 100vh)
      const scrolled = window.scrollY > window.innerHeight * 0.8;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('sticky_cta_dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-lg 
                       border-t border-zinc-800 shadow-2xl"
          >
            <div className="container-wide py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-white truncate">
                    Stop forgetting your best ideas
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400 truncate">
                    Join the waitlist for early access
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  data-track-cta="sticky-bar"
                  data-cta-location="sticky-bottom"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-accent text-white font-semibold 
                             rounded-xl hover:bg-accent-hover transition-colors 
                             shadow-lg shadow-accent/20 hover:shadow-accent/30 
                             whitespace-nowrap text-sm sm:text-base"
                >
                  Join Waitlist
                </button>

                {/* Dismiss Button */}
                <button
                  onClick={handleDismiss}
                  className="p-2 text-zinc-500 hover:text-white transition-colors 
                             rounded-lg hover:bg-zinc-800"
                  aria-label="Dismiss"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

