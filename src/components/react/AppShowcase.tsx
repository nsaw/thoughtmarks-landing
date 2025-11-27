import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Screen {
  id: string;
  title: string;
  description: string;
  image: string;
}

const screens: Screen[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Your command center. See recent captures, quick actions, and AI suggestions at a glance.',
    image: '/assets/MAIN-mockup-page-dashboard.PNG',
  },
  {
    id: 'capture',
    title: 'Voice Capture',
    description: 'Speak naturally. Real-time transcription with smart punctuation and formatting.',
    image: '/assets/MAIN-mockup-page-VTT.png',
  },
  {
    id: 'organize',
    title: 'Smart Bins',
    description: 'AI-organized categories that learn from your thinking patterns.',
    image: '/assets/MAIN-mockup-page-Bins.png',
  },
  {
    id: 'thoughtmark',
    title: 'Thoughtmark View',
    description: 'Deep dive into any note. See connections, tags, and related insights.',
    image: '/assets/MAIN-mockup-page-Thoughtmark.png',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Privacy controls, sync preferences, and personalization options.',
    image: '/assets/MAIN-mockup-page-settings.png',
  },
];

export default function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState(screens[0]);

  return (
    <section className="section bg-bg-base overflow-hidden">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-h1 font-bold text-text-primary mb-6">
            See it in action.
          </h2>
          <p className="text-xl text-text-secondary">
            A thoughtfully designed interface that gets out of your way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Screen Selector */}
          <div className="space-y-3 order-2 lg:order-1">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen)}
                className={`
                  w-full text-left p-5 rounded-xl border transition-all duration-300
                  ${activeScreen.id === screen.id
                    ? 'bg-bg-elevated border-accent/50 shadow-glow-sm'
                    : 'bg-transparent border-border hover:bg-bg-surface hover:border-text-muted'
                  }
                `}
              >
                <h3 className={`
                  text-lg font-semibold mb-1 transition-colors
                  ${activeScreen.id === screen.id ? 'text-text-primary' : 'text-text-secondary'}
                `}>
                  {screen.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {screen.description}
                </p>
              </button>
            ))}
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center order-1 lg:order-2">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            </div>

            {/* Phone frame */}
            <div className="relative w-72 sm:w-80 lg:w-96">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeScreen.id}
                  src={activeScreen.image}
                  alt={activeScreen.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="w-full rounded-3xl shadow-2xl border border-white/10"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

