import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchHabits, createHabit, toggleHabit, deleteHabit } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineFire } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const HabitTracker = ({ onUpdate }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en', { weekday: 'narrow' }),
      dayNum: d.getDate(),
      isToday: d.toISOString().split('T')[0] === today
    };
  });

  const loadHabits = async () => {
    try {
      const { data } = await fetchHabits();
      setHabits(data);
    } catch {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadHabits();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    try {
      await createHabit({ name: newHabitName });
      setNewHabitName('');
      setShowAdd(false);
      loadHabits();
      onUpdate?.();
      triggerSakuraRain(30);
      toast.success(
        <div className="text-center">
          <span className="font-semibold block text-sm">Habit created!</span>
          <span className="text-[11px] text-[#c9a84c] italic">初志貫徹 · Carry out original intention</span>
        </div>,
        { className: 'zen-toast' }
      );
    } catch {
      toast.error('Failed to create habit');
    }
  };

  const handleToggle = async (habitId, date, isCurrentlyCompleted) => {
    try {
      await toggleHabit(habitId, { date });
      loadHabits();
      onUpdate?.();

      if (!isCurrentlyCompleted) {
        triggerSakuraRain(25);
        toast.success(
          <div className="text-center">
            <span className="font-semibold block text-sm">Habit Completed!</span>
            <span className="text-[11px] text-[#c9a84c] italic">継続は力なり · Persistence is power</span>
          </div>,
          { className: 'zen-toast' }
        );
      }
    } catch {
      toast.error('Failed to toggle habit');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits();
      onUpdate?.();
    } catch {
      toast.error('Failed to delete habit');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="zen-card p-6 h-full flex flex-col justify-between"
      id="habit-tracker-section"
    >
      {/* Background Watermark - Strength (力) */}
      <div className="zen-watermark font-serif">力</div>

      <div className="z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-zen-800 uppercase tracking-widest font-serif">
              Habits Tracker
            </h2>
            <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
              習慣トラッカー · Daily consistency
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="zen-btn zen-btn-sm"
            id="add-habit-btn"
          >
            <HiOutlinePlus className="w-3.5 h-3.5" />
            Add Habit
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className="mb-5 flex gap-2 overflow-hidden"
            >
              <input
                type="text"
                placeholder="Name your daily practice..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="zen-input flex-1"
                id="habit-name-input"
                autoFocus
              />
              <button type="submit" className="zen-btn zen-btn-primary zen-btn-sm" id="habit-submit-btn">
                Add
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Day headers */}
        <div className="flex items-center mb-3.5 border-b border-zen-200/30 pb-2">
          <div className="flex-1" />
          <div className="flex gap-1.5">
            {last7Days.map(day => (
              <div
                key={day.date}
                className={`w-8 text-center flex flex-col items-center justify-center ${
                  day.isToday ? 'text-accent' : 'text-zen-400'
                }`}
              >
                <p className="text-[9px] uppercase tracking-widest font-semibold font-sans">
                  {day.day}
                </p>
                <p className={`text-[10px] font-sans mt-0.5 ${
                  day.isToday 
                    ? 'font-bold w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20' 
                    : ''
                }`}>
                  {day.dayNum}
                </p>
              </div>
            ))}
          </div>
          <div className="w-9" />
        </div>

        {/* Habits list */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-12 w-full" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-10">
              <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-3.5 text-zen-300">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 4" />
                <path d="M14 20l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs text-zen-400 font-serif">No habits active. Set a daily practice.</p>
            </div>
          ) : (
            <AnimatePresence>
              {habits.map((habit) => (
                <motion.div
                  key={habit._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="group flex items-center py-2.5 hover:bg-white/40 rounded-xl px-2.5 -mx-2.5 transition-all border border-transparent hover:border-white/50"
                >
                  {/* Habit name + streak */}
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="text-sm font-medium text-zen-800 truncate font-sans">
                      {habit.name}
                    </p>
                    {habit.currentStreak > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <HiOutlineFire className="w-3.5 h-3.5 text-accent-gold" />
                        <span className="text-[10px] text-accent-gold font-semibold font-sans">
                          {habit.currentStreak} day streak
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Checkboxes grid */}
                  <div className="flex gap-1.5">
                    {last7Days.map(day => {
                      const isCompleted = habit.completedDates?.includes(day.date);
                      return (
                        <button
                          key={day.date}
                          onClick={() => handleToggle(habit._id, day.date, isCompleted)}
                          className={`shoji-checkbox ${isCompleted ? 'checked' : ''}`}
                          id={`habit-toggle-${habit._id}-${day.date}`}
                        >
                          {isCompleted && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 350 }}
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                fill="none"
                                stroke="#7a9e7e"
                                strokeWidth="2.0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Delete Button */}
                  <div className="w-9 flex justify-end">
                    <button
                      onClick={() => handleDelete(habit._id)}
                      className="opacity-0 group-hover:opacity-100 transition-all text-zen-400 hover:text-accent cursor-pointer p-1"
                      id={`habit-delete-${habit._id}`}
                      title="Delete Habit"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HabitTracker;
