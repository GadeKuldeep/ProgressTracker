import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePhotograph } from 'react-icons/hi';

export const BACKGROUND_OPTIONS = [
  { id: 'bamboo', name: 'Misty Bamboo Forest', path: '/backgrounds/bamboo.png' },
  { id: 'sakura', name: 'Cherry Blossom Path', path: '/backgrounds/sakura.png' },
  { id: 'fuji', name: 'Mount Fuji at Dawn', path: '/backgrounds/fuji.png' },
  { id: 'garden', name: 'Zen Rock Garden', path: '/backgrounds/garden.png' },
  { id: 'pine', name: 'Foggy Pine Forest', path: '/backgrounds/pine.png' }
];

const BackgroundSelector = () => {
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('zen_bg');
    if (saved && BACKGROUND_OPTIONS.some(opt => opt.id === saved)) {
      return saved;
    }
    return 'bamboo';
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id) => {
    setSelected(id);
    localStorage.setItem('zen_bg', id);
  };

  const activeBg = BACKGROUND_OPTIONS.find(opt => opt.id === selected) || BACKGROUND_OPTIONS[0];

  return (
    <>
      {/* Full-screen Ken Burns Background Container */}
      <div className="ken-burns-bg">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeBg.id}
            src={activeBg.path}
            alt={activeBg.name}
            className="ken-burns-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="paper-overlay" />
      </div>

      {/* Floating Control Panel */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full bg-[#fafaf7]/85 backdrop-blur-md border border-white/60 shadow-md flex items-center justify-center text-zen-700 hover:text-accent hover:border-accent/40 transition-all"
            title="Choose Atmosphere"
            id="bg-selector-toggle"
          >
            <HiOutlinePhotograph className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-12 left-0 bg-[#fafaf7]/90 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl p-4 min-w-[200px]"
              >
                <p className="text-[11px] font-medium text-zen-500 uppercase tracking-widest mb-3 border-b border-zen-200/50 pb-1.5 font-serif">
                  庭園雰囲気 · Atmosphere
                </p>
                <div className="space-y-1.5">
                  {BACKGROUND_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                        selected === opt.id
                          ? 'bg-[#1a1a1a] text-[#fafaf7] font-medium'
                          : 'text-zen-700 hover:bg-zen-100'
                      }`}
                      id={`bg-opt-${opt.id}`}
                    >
                      <span>{opt.name}</span>
                      {selected === opt.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default BackgroundSelector;
