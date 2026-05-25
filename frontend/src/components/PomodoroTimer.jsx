import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { logPomodoro } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes

const PomodoroTimer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [sessionsToday, setSessionsToday] = useState(0);
  const intervalRef = useRef(null);

  const totalTime = mode === 'work' ? WORK_TIME : SHORT_BREAK;
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
      setMode('break');
      setTimeLeft(SHORT_BREAK);
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
      setTimeLeft(WORK_TIME);
    }
  }, [mode, onComplete]);

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
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  // SVG circle calculations
  const size = 160;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="zen-card-dark p-6 h-full flex flex-col items-center justify-between"
      id="pomodoro-section"
    >
      {/* Background Watermark - Time (時) */}
      <div className="zen-watermark font-serif">時</div>

      <div className="text-center w-full z-10">
        <h2 className="text-sm font-semibold text-[#fafaf7] uppercase tracking-widest font-serif">
          {mode === 'work' ? 'Focus Session' : 'Breathe & Rest'}
        </h2>
        <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
          {mode === 'work' ? '集中時間 · Time to Focus' : '息抜き · Time to rest'}
        </p>
      </div>

      {/* Timer SVG circle */}
      <div className="relative my-6 z-10" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={mode === 'work' ? '#c0392b' : '#7a9e7e'} // Vermillion for Focus, green for break
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: 'linear' }}
            className="shadow"
          />
        </svg>

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
          className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zen-400 hover:text-[#fafaf7] hover:border-white/30 transition-all cursor-pointer"
          title="Reset"
          id="pomodoro-reset"
        >
          <HiOutlineRefresh className="w-4.5 h-4.5" />
        </button>

        {/* Play/Pause toggle */}
        <button
          onClick={toggleTimer}
          className="w-12 h-12 rounded-full bg-[#c9a84c] text-[#1a1a1a] flex items-center justify-center hover:bg-[#c0392b] hover:text-white transition-all shadow-md cursor-pointer hover:scale-105"
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
      <div className="text-center mt-3 z-10">
        <p className="text-[10px] text-zen-500 uppercase tracking-widest font-sans">
          Completed Sessions
        </p>
      </div>
    </motion.div>
  );
};

export default PomodoroTimer;
