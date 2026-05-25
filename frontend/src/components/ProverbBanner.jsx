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
    <div className="relative zen-card quote-card-accent p-5 mb-5 md:p-6" id="proverb-banner">
      <div className="zen-watermark opacity-5 font-serif select-none pointer-events-none">格言</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="flex flex-col justify-center min-h-[64px]"
        >
          <h3 
            className="text-2xl md:text-3xl font-serif text-zen-800 tracking-wider mb-2 font-semibold"
            style={{ letterSpacing: '0.15em' }}
          >
            {japanese}
          </h3>
          <p className="text-xs md:text-sm text-zen-500 italic font-medium">
            &ldquo;{english}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProverbBanner;
