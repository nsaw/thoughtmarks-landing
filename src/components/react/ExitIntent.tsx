// src/components/react/ExitIntent.tsx
import { useState, useEffect } from 'react';
import WaitlistModal from './WaitlistModal';

export default function ExitIntent() {
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // Check if user already saw it or signed up this session
    const exitIntentShown = sessionStorage.getItem('exit_intent_shown');
    const hasSignedUp = sessionStorage.getItem('waitlist_signup_complete');
    
    if (exitIntentShown || hasSignedUp) {
      return;
    }

    let isExiting = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    // Desktop: Mouse leaving viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isExiting) {
        isExiting = true;
        exitTimer = setTimeout(() => {
          setShowExitModal(true);
          sessionStorage.setItem('exit_intent_shown', 'true');
        }, 100);
      }
    };

    // Mobile: Back button / history navigation attempt
    const handlePopState = () => {
      if (!isExiting) {
        isExiting = true;
        setShowExitModal(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
        // Push state back to prevent actual navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Add extra history entry for back button detection
    window.history.pushState(null, '', window.location.href);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
      if (exitTimer !== undefined) clearTimeout(exitTimer);
    };
  }, []);

  const handleClose = () => {
    setShowExitModal(false);
  };

  const handleSuccess = () => {
    sessionStorage.setItem('waitlist_signup_complete', 'true');
    setShowExitModal(false);
  };

  if (!showExitModal) return null;

  return (
    <WaitlistModal 
      isOpen={showExitModal} 
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
}

