import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineLogout, HiOutlineChevronDown } from 'react-icons/hi';

const Header = () => {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
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
      second: '2-digit',
      hour12: true
    });
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#user-menu-container')) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(250, 250, 247, 0.72)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      {/* Subtle top border gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), rgba(192,57,43,0.3), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">

          {/* ── Logo ── */}
          <div className="flex items-center gap-3">
            {/* Animated Ensō gold circle */}
            <motion.svg
              width="32" height="32" viewBox="0 0 32 32"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.5))' }}
            >
              <circle
                cx="16" cy="16" r="12"
                fill="none"
                stroke="url(#logoGrad)"
                strokeWidth="2.2"
                strokeDasharray="65"
                strokeDashoffset="12"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#c0392b" />
                </linearGradient>
              </defs>
            </motion.svg>

            <div className="flex flex-col leading-none">
              <span
                className="text-[15px] font-bold text-zen-800 font-serif tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #524b43 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Zen Tracker
              </span>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.22em] mt-0.5"
                style={{ color: '#c0392b', letterSpacing: '0.22em' }}>
                日常の美 · Pure Practice
              </span>
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-4">

            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-zen-200/40">
              {/* Live dot indicator */}
              <div className="relative flex items-center justify-center w-4 h-4">
                <span className="absolute w-4 h-4 rounded-full bg-accent/10 animate-ping" style={{ animationDuration: '2s' }} />
                <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #c9a84c, #c0392b)' }} />
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-semibold text-zen-700 tracking-wide font-sans leading-none">
                  {formatDate()}
                </p>
                <p className="text-[11px] text-zen-500 font-sans font-medium mt-0.5 tabular-nums">
                  {formatTime()}
                </p>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" id="user-menu-container">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background: showMenu ? 'rgba(250,250,247,0.95)' : 'rgba(255,255,255,0.55)',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
                id="user-menu-btn"
              >
                {/* Avatar circle */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #c9a84c 0%, #c0392b 100%)',
                    boxShadow: '0 2px 6px rgba(192,57,43,0.3)'
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || <HiOutlineUser className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold text-zen-700 font-sans hidden sm:block max-w-[80px] truncate">
                  {user?.name}
                </span>
                <motion.div
                  animate={{ rotate: showMenu ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <HiOutlineChevronDown className="w-3.5 h-3.5 text-zen-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 min-w-[180px] z-55"
                    style={{
                      background: 'rgba(250,250,247,0.97)',
                      backdropFilter: 'blur(18px)',
                      border: '1.5px solid rgba(255,255,255,0.75)',
                      borderRadius: '16px',
                      boxShadow: '0 16px 50px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
                      padding: '8px',
                    }}
                  >
                    {/* User info header */}
                    <div className="px-3 py-2.5 mb-1 rounded-xl"
                      style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
                      <p className="text-[9px] text-zen-400 font-serif italic mb-0.5">Logged in as</p>
                      <p className="text-xs font-bold text-zen-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-zen-500 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => { logout(); setShowMenu(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-zen-600 hover:text-accent hover:bg-red-50/80 transition-all cursor-pointer font-medium"
                      id="logout-btn"
                    >
                      <HiOutlineLogout className="w-4 h-4" />
                      Sign Out
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
