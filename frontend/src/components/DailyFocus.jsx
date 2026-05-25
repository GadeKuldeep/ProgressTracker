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

const ProgressRing = ({ progress, size = 90, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(201, 168, 76, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={isComplete ? '#7a9e7e' : 'url(#progressGrad)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-base font-semibold text-zen-800 font-sans leading-none"
        >
          {progress}%
        </motion.span>
        <span className="text-[8px] text-zen-400 font-serif italic mt-0.5 leading-none">today</span>
      </div>
    </div>
  );
};

const AnimatedStat = ({ value, label, subLabel }) => (
  <div className="stat-card flex-1">
    <div className="flex items-baseline gap-1.5 mb-1">
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-light text-zen-800 font-sans leading-none"
        style={{ letterSpacing: '-0.02em' }}
      >
        {value}
      </motion.span>
      {subLabel && (
        <span className="text-zen-400 text-xs font-serif italic">{subLabel}</span>
      )}
    </div>
    <p className="text-[9.5px] text-zen-500 font-bold uppercase tracking-widest font-sans">{label}</p>
  </div>
);

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

  const habitProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="zen-card p-6 h-full flex flex-col justify-between"
      id="daily-focus-section"
    >
      {/* Background Watermark */}
      <div className="zen-watermark font-serif">集中</div>

      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-4 z-10 relative">
        <div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-semibold text-zen-800 font-serif block leading-none"
          >
            {greeting.japanese}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xs text-zen-500 italic block mt-1.5"
          >
            &ldquo;{greeting.english}&rdquo;
          </motion.span>
        </div>
        <div className="text-right">
          <p
            className="text-[10px] font-bold text-zen-700 tracking-wide uppercase font-sans px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-[9px] text-zen-400 font-serif mt-1.5">穏やかな心 · Calm Mind</p>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center z-10 relative py-1">
        {/* Left Col - Three.js Ring */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative">
            <ZenRing3D />
            <div className="absolute -bottom-3 inset-x-0 text-center">
              <span
                className="text-[8px] uppercase tracking-[0.3em] font-bold"
                style={{ color: 'rgba(201,168,76,0.7)' }}
              >
                Zen Ring
              </span>
            </div>
          </div>
        </div>

        {/* Right Col - Core Stats */}
        <div className="md:col-span-7 space-y-4">
          {/* Focus score + ring */}
          <div className="flex items-center gap-4">
            <ProgressRing progress={habitProgress} />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-light text-zen-800 tracking-tight font-sans"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {focusScore}
                </motion.span>
                <span className="text-[9.5px] text-zen-500 uppercase tracking-widest font-bold font-sans">
                  Focus Score
                </span>
              </div>

              {/* Focus bar */}
              <div
                className="h-2.5 rounded-full overflow-hidden border border-white/50 shadow-inner"
                style={{ background: 'rgba(201,168,76,0.08)', maxWidth: '200px' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${focusScore}%` }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full progress-bar-fill"
                  style={{
                    background: 'linear-gradient(90deg, #c9a84c 0%, #c0392b 100%)',
                    boxShadow: '0 1px 4px rgba(192,57,43,0.3)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-3">
            <AnimatedStat
              value={completedToday}
              subLabel={`/${totalHabits}`}
              label="Habits Done"
            />
            <AnimatedStat
              value={todayPomodoros}
              label="Focus Sessions"
            />
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="mt-4 pt-3.5 z-10 relative" style={{ borderTop: '1px solid rgba(168,159,145,0.15)' }}>
        <p className="text-[10.5px] text-zen-500 italic text-center font-serif leading-relaxed">
          ✦ {randomMsg} ✦
        </p>
      </div>
    </motion.div>
  );
};

export default DailyFocus;
