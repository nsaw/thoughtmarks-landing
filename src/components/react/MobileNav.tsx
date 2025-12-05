import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

const compareLinks: NavLink[] = [
  { label: 'vs Voicenotes', href: '/vs/voicenotes' },
  { label: 'vs Notion', href: '/vs/notion' },
  { label: 'vs Otter.ai', href: '/vs/otter' },
  { label: 'vs Obsidian', href: '/vs/obsidian' },
];

const useCaseLinks: NavLink[] = [
  { label: 'For ADHD', href: '/for/adhd' },
  { label: 'For Creatives', href: '/for/creatives' },
  { label: 'For Students', href: '/for/students' },
  { label: 'For Entrepreneurs', href: '/for/entrepreneurs' },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
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

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg 
                   text-text-secondary hover:bg-bg-surface hover:text-text-primary 
                   transition-colors focus-visible:outline-none focus-visible:ring-2 
                   focus-visible:ring-accent"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-bg-base/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed right-4 top-20 z-50 w-64 rounded-2xl border border-border 
                         bg-bg-elevated p-4 shadow-card"
            >
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-xl px-4 py-3 text-text-secondary 
                                 hover:bg-bg-surface hover:text-text-primary 
                                 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

                {/* Compare Section */}
                <li>
                  <button
                    onClick={() => setCompareOpen(!compareOpen)}
                    className="w-full flex items-center justify-between rounded-xl px-4 py-3 
                               text-text-secondary hover:bg-bg-surface hover:text-text-primary 
                               transition-colors"
                  >
                    <span>Compare</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${compareOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {compareOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-4 border-l border-border"
                      >
                        {compareLinks.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="block rounded-r-xl px-4 py-2 text-sm text-text-secondary 
                                         hover:bg-bg-surface hover:text-text-primary transition-colors"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Use Cases Section */}
                <li>
                  <button
                    onClick={() => setUseCasesOpen(!useCasesOpen)}
                    className="w-full flex items-center justify-between rounded-xl px-4 py-3 
                               text-text-secondary hover:bg-bg-surface hover:text-text-primary 
                               transition-colors"
                  >
                    <span>Use Cases</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${useCasesOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {useCasesOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-4 border-l border-border"
                      >
                        {useCaseLinks.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="block rounded-r-xl px-4 py-2 text-sm text-text-secondary 
                                         hover:bg-bg-surface hover:text-text-primary transition-colors"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Support Link */}
                <li>
                  <a
                    href="/support"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-4 py-3 text-text-secondary 
                               hover:bg-bg-surface hover:text-text-primary 
                               transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>

              <div className="mt-4 border-t border-border pt-4">
                <a
                  href="#download"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Get the App
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

