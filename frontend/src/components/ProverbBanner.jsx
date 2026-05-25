import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quotes from '../utils/quotes';

const ProverbBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const [japanese, english] = quotes[index].split(' — ');

  return (
    <div
      className="relative quote-card-accent mb-5 overflow-hidden"
      id="proverb-banner"
      style={{
        background: 'rgba(250, 250, 247, 0.70)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.65)',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        borderLeft: '3px solid #c0392b',
        padding: '18px 24px',
      }}
    >
      {/* Watermark */}
      <div className="zen-watermark font-serif select-none pointer-events-none" style={{ opacity: 0.04 }}>格言</div>

      {/* Decorative red accent corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        background: 'radial-gradient(circle at top right, rgba(192,57,43,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="flex items-center justify-between gap-4">
        {/* Quote content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="flex flex-col justify-center min-h-[56px] flex-1"
          >
            <h3
              className="text-xl md:text-2xl font-serif text-zen-800 font-semibold leading-tight mb-1.5"
              style={{ letterSpacing: '0.12em' }}
            >
              {japanese}
            </h3>
            <p className="text-xs md:text-sm text-zen-500 italic font-medium leading-relaxed">
              &ldquo;{english}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots on the right */}
        <div className="hidden sm:flex flex-col items-center gap-1.5 shrink-0 pr-1">
          {quotes.slice(0, Math.min(quotes.length, 8)).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="quote-dot transition-all"
              style={{
                width: i === index ? '16px' : '5px',
                height: '5px',
                borderRadius: i === index ? '3px' : '50%',
                background: i === index ? '#c0392b' : 'rgba(168,159,145,0.3)',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
              }}
              title={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Auto-progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: '3px', right: 0,
        height: '2px',
        background: 'rgba(168,159,145,0.1)',
        overflow: 'hidden',
      }}>
        <motion.div
          key={index}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #c0392b, #c9a84c)',
          }}
        />
      </div>
    </div>
  );
};

export default ProverbBanner;
