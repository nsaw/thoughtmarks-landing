// src/components/react/WaitlistForm.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

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
          source: 'waitlist-page',
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
          source: 'waitlist-page',
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

  if (formState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          You're on the list!
        </h2>
        <p className="text-xl text-zinc-400 mb-2">
          (We knew you were interesting.)
        </p>
        <p className="text-zinc-500">
          Check your inbox for a confirmation email. We'll let you know the moment Thoughtmarks is ready.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="waitlist-page-email" className="block text-sm font-medium text-zinc-300 mb-2">
          Email address <span className="text-accent">*</span>
        </label>
        <input
          ref={emailInputRef}
          id="waitlist-page-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={formState === 'submitting'}
          className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl
                     text-white text-lg placeholder-zinc-500 
                     focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        />
      </div>

      <div>
        <label htmlFor="waitlist-page-name" className="block text-sm font-medium text-zinc-300 mb-2">
          Your name <span className="text-zinc-500">(optional, but we like knowing who you are)</span>
        </label>
        <input
          id="waitlist-page-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should we call you?"
          disabled={formState === 'submitting'}
          className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl
                     text-white text-lg placeholder-zinc-500 
                     focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        />
      </div>

      {errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400"
        >
          {errorMessage}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full px-8 py-5 bg-accent text-white rounded-xl font-bold text-lg
                   hover:bg-accent-hover transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-3
                   shadow-lg shadow-accent/20 hover:shadow-accent/30"
      >
        {formState === 'submitting' ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Joining the waitlist...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Get Early Access
          </>
        )}
      </button>

      <p className="text-zinc-500 text-sm text-center">
        No spam, ever. Just one email when we launch. Unsubscribe anytime.
      </p>
    </form>
  );
}

