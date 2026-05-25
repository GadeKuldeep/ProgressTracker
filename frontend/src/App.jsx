import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import DailyFocus from './components/DailyFocus';
import GoalTracker from './components/GoalTracker';
import HabitTracker from './components/HabitTracker';
import Analytics from './components/Analytics';
import ReflectionNotes from './components/ReflectionNotes';
import PomodoroTimer from './components/PomodoroTimer';
import ProverbBanner from './components/ProverbBanner';
import BackgroundSelector from './components/BackgroundSelector';
import SakuraShower, { triggerSakuraRain } from './components/SakuraShower';
import { fetchAnalytics } from './services/api';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-50">
    {/* Background texture overlay */}
    <div className="paper-overlay" opacity="0.1" />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl mb-4 font-serif text-[#c9a84c] font-semibold"
      >
        禅
      </motion.div>
      <p className="text-[10px] text-[#fafaf7] tracking-[0.4em] uppercase font-sans">
        Breathe · 呼吸を整える
      </p>
    </motion.div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics, refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  // Welcome user with some initial sakura rain on successful load
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        triggerSakuraRain(35);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black">
        {/* Animated Nature Background behind floating Auth panel */}
        <BackgroundSelector />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative zen-card max-w-md w-full p-8 md:p-10 text-center border border-white/60 bg-[#fafaf7]/70 backdrop-blur-md shadow-2xl"
        >
          {/* Zen circle graphic */}
          <motion.svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            className="mx-auto mb-6 text-accent-gold filter drop-shadow-md"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          >
            <circle
              cx="45"
              cy="45"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="240"
              strokeDashoffset="35"
              strokeLinecap="round"
            />
          </motion.svg>

          <h1
            className="text-3xl font-bold text-zen-800 mb-2 font-serif tracking-wider"
          >
            Zen Tracker
          </h1>
          <p className="text-xs text-accent uppercase tracking-widest font-bold font-sans mb-5">
            静かな生産性 · Mindful Clarity
          </p>
          <p className="text-xs text-zen-500 mb-8 leading-relaxed font-medium">
            A serene harbor for your daily intentions.<br />
            Cultivate your habits, trace your progress, and breathe.
          </p>

          <button
            onClick={() => setShowAuth(true)}
            className="zen-btn zen-btn-primary px-10 py-3 text-sm font-semibold tracking-wider hover:scale-102"
            id="begin-journey-btn"
          >
            Begin Your Journey
          </button>

          <div className="border-t border-zen-200/50 mt-10 pt-6">
            <p className="text-[10px] text-zen-400 font-serif italic font-semibold">
              一歩ずつ · One step at a time
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      {/* 1. Global Nature Background & Paper Overlay */}
      <BackgroundSelector />

      {/* 2. Global Sakura Rain Particle Overlay */}
      <SakuraShower />

      {/* 3. Header navigation */}
      <Header />

      {/* 4. Dashboard grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pb-12 relative z-10">
        
        {/* Auto-rotating Proverb Banner at the very top */}
        <ProverbBanner />

        {/* Daily Focus + Pomodoro Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <DailyFocus analytics={analytics} />
          </div>
          <div>
            <PomodoroTimer onComplete={triggerRefresh} />
          </div>
        </div>

        {/* Goals + Habits Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GoalTracker onUpdate={triggerRefresh} />
          <HabitTracker onUpdate={triggerRefresh} />
        </div>

        {/* Analytics + Reflections Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Analytics analytics={analytics} />
          <ReflectionNotes />
        </div>
      </main>
    </div>
  );
}

export default App;
