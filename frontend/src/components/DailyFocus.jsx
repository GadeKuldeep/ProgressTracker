import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ZenRing3D from './ZenRing3D';

const motivationalMessages = [
  "Every step forward matters. 一歩ずつ。",
  "Stay present. Stay focused. 今ここに。",
  "Consistency creates mastery. 継続は力なり。",
  "Breathe. Focus. Achieve. 呼吸を整えて。",
  "Progress, not perfection. 日々前進。",
  "Your future self will thank you. 未来のために。"
];

const getMessage = () => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

const ProgressRing = ({ progress, size = 95, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(201, 168, 76, 0.12)" // Soft gold track
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c9a84c" // Gold outline
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'cubicBezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-light text-zen-800 font-sans"
        >
          {progress}%
        </motion.span>
        <span className="text-[9px] text-zen-400 font-serif italic mt-0.5">progress</span>
      </div>
    </div>
  );
};

const DailyFocus = ({ analytics }) => {
  const getInitialGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { japanese: 'おはよう', english: 'Good morning' };
    if (hour >= 12 && hour < 17) return { japanese: 'こんにちは', english: 'Good afternoon' };
    return { japanese: 'こんばんは', english: 'Good evening' };
  };

  const [greeting] = useState(getInitialGreeting);
  const [randomMsg] = useState(getMessage);
  
  const overview = analytics?.overview || {};
  const focusScore = overview.focusScore || 0;
  const completedToday = overview.todayHabitsCompleted || 0;
  const totalHabits = overview.totalHabits || 0;
  const todayPomodoros = overview.todayPomodoros || 0;

  // Calculate today's overall progress
  const habitProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="zen-card p-6 h-full flex flex-col justify-between"
      id="daily-focus-section"
    >
      {/* Background Watermark - Focus (集中) */}
      <div className="zen-watermark font-serif">集中</div>

      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-4 z-10">
        <div>
          <span className="text-xl font-semibold text-zen-800 font-serif block">
            {greeting.japanese}
          </span>
          <span className="text-xs text-zen-500 italic block mt-0.5">
            &ldquo;{greeting.english}&rdquo;
          </span>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-zen-600 tracking-wide uppercase">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-[10px] text-zen-400 font-serif">穏やかな心 · Calm Mind</p>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10 py-2">
        {/* Left Col - Three.js refined Ring */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative">
            <ZenRing3D />
            <div className="absolute -bottom-2 inset-x-0 text-center">
              <span className="text-[9px] uppercase tracking-[0.25em] text-zen-300 font-semibold">
                Zen Ring
              </span>
            </div>
          </div>
        </div>

        {/* Right Col - Core Stats */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-5">
            <ProgressRing progress={habitProgress} />

            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-3xl font-light text-zen-800 tracking-tight font-sans">
                  {focusScore}
                </span>
                <span className="text-[10px] text-zen-500 uppercase tracking-widest font-semibold">
                  Focus Score
                </span>
              </div>
              <div className="h-2 bg-zen-100/60 rounded-full overflow-hidden w-full max-w-[200px] border border-white/40 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${focusScore}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-accent rounded-full shadow"
                  style={{
                    background: 'linear-gradient(90deg, #c9a84c 0%, #c0392b 100%)' // Gold to Vermillion
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3.5 pt-1.5">
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-sm">
              <p className="text-xl font-light text-zen-800">
                {completedToday}
                <span className="text-zen-400 text-xs font-serif italic">/{totalHabits}</span>
              </p>
              <p className="text-[10px] text-zen-500 font-medium uppercase tracking-wider mt-0.5">
                Habits Completed
              </p>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-sm">
              <p className="text-xl font-light text-zen-800">{todayPomodoros}</p>
              <p className="text-[10px] text-zen-500 font-medium uppercase tracking-wider mt-0.5">
                Focus Sessions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Bottom Quote */}
      <div className="mt-4 border-t border-zen-200/40 pt-3 z-10">
        <p className="text-[11px] text-zen-500 italic text-center font-medium font-serif">
          {randomMsg}
        </p>
      </div>
    </motion.div>
  );
};

export default DailyFocus;
