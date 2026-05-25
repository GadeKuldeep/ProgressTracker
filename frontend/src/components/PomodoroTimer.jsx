import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { logPomodoro } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const PRESETS = {
  work: {
    label: 'Focus',
    seconds: 25 * 60,
    subLabel: '集中時間 · Time to Focus',
    colorStart: '#c0392b', // Vermillion
    colorEnd: '#e74c3c',
    glowColor: 'rgba(192, 57, 43, 0.4)'
  },
  short: {
    label: 'Short Break',
    seconds: 5 * 60,
    subLabel: '息抜き · Time to Rest',
    colorStart: '#7a9e7e', // Forest Green
    colorEnd: '#a2c4a6',
    glowColor: 'rgba(122, 158, 126, 0.4)'
  },
  long: {
    label: 'Long Break',
    seconds: 15 * 60,
    subLabel: '長閑 · Deep Breath',
    colorStart: '#2c3e50', // Slate Indigo
    colorEnd: '#34495e',
    glowColor: 'rgba(44, 62, 80, 0.4)'
  }
};

const PomodoroTimer = ({ onComplete }) => {
  const [mode, setMode] = useState('work'); // 'work' | 'short' | 'long'
  const [timeLeft, setTimeLeft] = useState(PRESETS.work.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const intervalRef = useRef(null);

  const currentPreset = PRESETS[mode];
  const totalTime = currentPreset.seconds;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = useCallback(async () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (mode === 'work') {
      try {
        await logPomodoro({ duration: 25 });
        setSessionsToday(p => p + 1);
        onComplete?.();
        
        // Trigger sakura petal rain & success toast
        triggerSakuraRain(80);
        
        toast.success(
          <div className="text-center">
            <span className="font-semibold block text-sm text-[#fafaf7]">Focus Session Complete!</span>
            <span className="text-[11px] text-[#c9a84c] italic">お疲れ様 · Well done</span>
          </div>,
          { className: 'zen-toast' }
        );
      } catch {
        toast.error('Failed to log session');
      }
      // Suggest a break
      const nextMode = (sessionsToday + 1) % 4 === 0 ? 'long' : 'short';
      setMode(nextMode);
      setTimeLeft(PRESETS[nextMode].seconds);
    } else {
      triggerSakuraRain(40);
      toast.success(
        <div className="text-center">
          <span className="font-semibold block text-sm text-[#fafaf7]">Break Complete!</span>
          <span className="text-[11px] text-[#c9a84c] italic">さあ、始めましょう · Ready to begin?</span>
        </div>,
        { className: 'zen-toast' }
      );
      setMode('work');
      setTimeLeft(PRESETS.work.seconds);
    }
  }, [mode, onComplete, sessionsToday]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(currentPreset.seconds);
  };

  const handlePresetSelect = (presetKey) => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(presetKey);
    setTimeLeft(PRESETS[presetKey].seconds);
  };

  // SVG circle calculations
  const size = 166;
  const strokeWidth = 5.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="zen-card-dark p-6 h-full flex flex-col items-center justify-between min-h-[380px]"
      id="pomodoro-section"
    >
      {/* Background Watermark - Time (時) */}
      <div className="zen-watermark font-serif">時</div>

      {/* Preset Selectors */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-full z-10 w-full justify-around mb-2">
        {Object.keys(PRESETS).map((key) => (
          <button
            key={key}
            onClick={() => handlePresetSelect(key)}
            className={`px-3 py-1 text-[10px] uppercase font-sans tracking-wider rounded-full transition-all cursor-pointer ${
              mode === key
                ? 'bg-white/15 text-[#fafaf7] font-semibold border border-white/20'
                : 'text-zen-400 hover:text-[#fafaf7]'
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="text-center w-full z-10">
        <h2 className="text-sm font-semibold text-[#fafaf7] uppercase tracking-widest font-serif">
          {currentPreset.label}
        </h2>
        <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
          {currentPreset.subLabel}
        </p>
      </div>

      {/* Timer SVG circle */}
      <div className="relative my-4 z-10" style={{ width: size, height: size }}>
        <motion.div
          animate={isRunning ? { scale: [1, 1.015, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <svg width={size} height={size} className="-rotate-90">
            <defs>
              <linearGradient id={`gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentPreset.colorStart} />
                <stop offset="100%" stopColor={currentPreset.colorEnd} />
              </linearGradient>
            </defs>
            {/* Background circle track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth={strokeWidth}
            />
            {/* Foreground animated progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#gradient-${mode})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              style={{
                filter: `drop-shadow(0px 0px 5px ${currentPreset.glowColor})`
              }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-light text-[#fafaf7] tracking-widest font-sans">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[9px] text-[#c9a84c] mt-1.5 uppercase tracking-[0.25em] font-semibold">
            {mode === 'work' ? 'FOCUS' : 'REST'}
          </span>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex items-center gap-4 z-10 w-full justify-center">
        {/* Reset button */}
        <button
          onClick={resetTimer}
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zen-400 hover:text-[#fafaf7] hover:border-white/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Reset"
          id="pomodoro-reset"
        >
          <HiOutlineRefresh className="w-4.5 h-4.5" />
        </button>

        {/* Play/Pause toggle */}
        <button
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full bg-[#c9a84c] text-[#1a1a1a] flex items-center justify-center hover:text-white transition-all shadow-md cursor-pointer hover:scale-108 active:scale-95"
          style={{
            backgroundColor: isRunning ? '#c0392b' : '#c9a84c',
            boxShadow: `0 4px 14px ${isRunning ? 'rgba(192, 57, 43, 0.4)' : 'rgba(201, 168, 76, 0.3)'}`
          }}
          id="pomodoro-toggle"
        >
          {isRunning ? (
            <HiOutlinePause className="w-5 h-5" />
          ) : (
            <HiOutlinePlay className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Session count tracker */}
        <div 
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs text-[#c9a84c] font-semibold"
          title="Sessions Completed Today"
        >
          {sessionsToday}
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-2 z-10">
        <p className="text-[10px] text-zen-500 uppercase tracking-widest font-sans">
          Completed Sessions
        </p>
      </div>
    </motion.div>
  );
};

export default PomodoroTimer;
