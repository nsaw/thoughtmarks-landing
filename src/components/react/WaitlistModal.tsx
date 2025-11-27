// src/components/react/WaitlistModal.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }

    setFormState('submitting');
    setErrorMessage('');

    try {
      // API URL - Fly.io production deployment
      const apiUrl = 'https://thoughtmarks-api.fly.dev';
      
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source: 'landing-modal',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setFormState('success');
      
      // Track conversion in PostHog
      if (typeof window !== 'undefined' && (window as unknown as { posthog?: { capture: (event: string, props: Record<string, string>) => void } }).posthog) {
        (window as unknown as { posthog: { capture: (event: string, props: Record<string, string>) => void } }).posthog.capture('waitlist_signup', {
          source: 'landing-modal',
          email_domain: email.split('@')[1] || 'unknown',
        });
      }
      
      setEmail('');
      setName('');
    } catch (err) {
      setFormState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const resetAndClose = () => {
    setFormState('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white 
                         transition-colors rounded-lg hover:bg-zinc-800"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {formState === 'success' ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    You're in.
                  </h3>
                  <p className="text-zinc-400 mb-2">
                    (We knew you were interesting.)
                  </p>
                  <p className="text-zinc-500 text-sm mb-6">
                    Check your inbox for a confirmation email.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="px-6 py-3 bg-zinc-800 text-white rounded-xl 
                               hover:bg-zinc-700 transition-colors font-medium"
                  >
                    Got it
                  </button>
                </motion.div>
              ) : (
                // Form state
                <>
                  <div className="text-center mb-8">
                    <p className="text-brand-yellow font-script text-xl mb-2">
                      bookmarks for your brain
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Get early access
                    </h2>
                    <p className="text-zinc-400">
                      Be the first to know when Thoughtmarks launches. No spam, just one email when we're ready.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="waitlist-email" className="block text-sm font-medium text-zinc-300 mb-2">
                        Email <span className="text-accent">*</span>
                      </label>
                      <input
                        ref={emailInputRef}
                        id="waitlist-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        disabled={formState === 'submitting'}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl
                                   text-white placeholder-zinc-500 
                                   focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="waitlist-name" className="block text-sm font-medium text-zinc-300 mb-2">
                        Name <span className="text-zinc-500">(optional)</span>
                      </label>
                      <input
                        id="waitlist-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What should we call you?"
                        disabled={formState === 'submitting'}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl
                                   text-white placeholder-zinc-500 
                                   focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-colors"
                      />
                    </div>

                    {errorMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errorMessage}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="w-full px-6 py-4 bg-accent text-white rounded-xl font-semibold
                                 hover:bg-accent-hover transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Joining...
                        </>
                      ) : (
                        'Join the waitlist'
                      )}
                    </button>
                  </form>

                  <p className="text-zinc-500 text-xs text-center mt-6">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

