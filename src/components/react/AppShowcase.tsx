import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Screen {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const appScreens: Screen[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Your command center.',
    description: 'Recent captures, quick actions, and your thinking patterns at a glance.',
    image: '/assets/MAIN-mockup-page-dashboard.PNG',
  },
  {
    id: 'voice-capture',
    title: 'Voice Capture',
    subtitle: 'Hands-free brilliance.',
    description: 'Speak naturally. Real-time transcription. Smart punctuation. Keep moving.',
    image: '/assets/MAIN-mockup-page-VTT.png',
  },
  {
    id: 'smart-bins',
    title: 'Smart Bins',
    subtitle: 'Organization without effort.',
    description: 'AI-organized categories that learn how you think. No folders required.',
    image: '/assets/MAIN-mockup-page-Bins.png',
  },
  {
    id: 'thoughtmark-view',
    title: 'Deep Dive',
    subtitle: 'Your thoughts, connected.',
    description: 'See how your ideas relate. Tags, links, and the web you weave.',
    image: '/assets/MAIN-mockup-page-Thoughtmark.png',
  },
  {
    id: 'settings',
    title: 'Your Rules',
    subtitle: 'Privacy first.',
    description: 'Encryption, sync preferences, and controls that respect your data.',
    image: '/assets/MAIN-mockup-page-settings.png',
  },
];

export default function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState(appScreens[0]);

  return (
    <section id="app-showcase" className="section relative overflow-hidden bg-black">
      {/* Organic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full 
                        bg-gradient-to-r from-accent/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full 
                        bg-gradient-to-l from-amber-500/10 to-transparent blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            See it in action.
          </h2>
          <p className="text-xl text-zinc-400">
            A thoughtfully designed interface that gets out of your way.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Screen selector */}
          <div className="lg:col-span-2 space-y-3">
            {appScreens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen)}
                className={`
                  w-full text-left p-5 rounded-xl border transition-all duration-300
                  ${activeScreen.id === screen.id
                    ? 'bg-zinc-900 border-accent/50 shadow-lg shadow-accent/10'
                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    w-2 h-2 rounded-full mt-2 transition-colors duration-300
                    ${activeScreen.id === screen.id ? 'bg-accent' : 'bg-zinc-700'}
                  `} />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{screen.title}</h3>
                    <p className="text-sm text-zinc-400 mb-1">{screen.subtitle}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{screen.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Screen display with 3D phone mockup */}
          <div className="lg:col-span-3 relative flex items-center justify-center min-h-[600px]">
            {/* Glow behind phone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[550px] bg-gradient-to-b from-accent/20 via-accent/10 to-transparent 
                              rounded-full blur-3xl" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen.id}
                initial={{ opacity: 0, y: 20, rotateY: -5 }}
                animate={{ opacity: 1, y: 0, rotateY: -3 }}
                exit={{ opacity: 0, y: -20, rotateY: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative"
                style={{ perspective: '1200px' }}
              >
                {/* Phone frame */}
                <div 
                  className="relative p-3 sm:p-[14px] rounded-[47px] sm:rounded-[52px]"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
                    boxShadow: `
                      0 0 80px -20px rgba(59, 130, 246, 0.3),
                      0 25px 50px -12px rgba(0, 0, 0, 0.8),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      inset 0 -1px 0 rgba(255, 255, 255, 0.05)
                    `,
                    transform: 'rotateY(-3deg) rotateX(2deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Dynamic Island */}
                  <div 
                    className="absolute top-[24px] sm:top-[28px] left-1/2 -translate-x-1/2 
                               w-[90px] sm:w-[110px] h-[26px] sm:h-[32px] 
                               bg-black rounded-[20px] z-10"
                  />
                  
                  {/* Screen */}
                  <div className="relative rounded-[40px] sm:rounded-[44px] overflow-hidden bg-black">
                    <img
                      src={activeScreen.image}
                      alt={activeScreen.title}
                      className="w-[260px] sm:w-[300px] lg:w-[340px] block"
                    />
                  </div>
                  
                  {/* Frame highlights */}
                  <div 
                    className="absolute top-0 left-[52px] right-[52px] h-px"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 80%, transparent 100%)'
                    }}
                  />
                  
                  {/* Glass reflection */}
                  <div 
                    className="absolute top-3 sm:top-[14px] left-3 sm:left-[14px] right-3 sm:right-[14px] h-[40%] 
                               rounded-t-[40px] sm:rounded-t-[44px] pointer-events-none z-5"
                    style={{
                      background: 'linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)'
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
