import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

const Header = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 bg-[#fafaf7]/70 backdrop-blur-lg border-b border-white/40 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Calligraphic Accent */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Gold brush Ensō circle logo */}
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-accent-gold filter drop-shadow-sm">
                <circle
                  cx="15"
                  cy="15"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.0"
                  strokeDasharray="72"
                  strokeDashoffset="10"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col">
                <span
                  className="text-base font-semibold text-zen-800 font-serif leading-none tracking-wide"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Zen Tracker
                </span>
                <span className="text-[9px] text-accent uppercase tracking-widest font-bold font-sans mt-0.5">
                  日常の美 · Pure Practice
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time + Profile Menu */}
          <div className="flex items-center gap-5">
            {/* Timestamp */}
            <div className="text-right hidden md:block border-r border-zen-200/50 pr-5 py-0.5">
              <p className="text-[10px] font-bold text-zen-700 tracking-wide font-sans">{formatDate()}</p>
              <p className="text-[9px] text-zen-400 font-serif italic mt-0.5">{formatTime()}</p>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2.5 py-1.5 px-3.5 rounded-xl bg-white/50 border border-white/60 hover:bg-[#fafaf7] hover:border-accent-gold/45 shadow-sm transition-all cursor-pointer"
                id="user-menu-btn"
              >
                <div className="w-6.5 h-6.5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shadow-inner">
                  <HiOutlineUser className="w-3.5 h-3.5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-zen-700 font-sans hidden sm:block">
                  {user?.name}
                </span>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 top-full mt-2 bg-[#fafaf7]/95 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl py-2 min-w-[150px] z-55"
                  >
                    <div className="px-3 py-1.5 border-b border-zen-200/40 mb-1.5">
                      <p className="text-[10px] text-zen-400 font-serif">Logged in as</p>
                      <p className="text-xs font-bold text-zen-800 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setShowMenu(false); }}
                      className="flex items-center gap-2.5 w-full px-4.5 py-2 text-xs text-zen-600 hover:text-accent hover:bg-white/50 transition-colors cursor-pointer"
                      id="logout-btn"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
