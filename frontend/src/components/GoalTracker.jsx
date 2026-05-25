import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const GoalTracker = ({ onUpdate }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', notes: '', deadline: '' });

  const loadGoals = async () => {
    try {
      const { data } = await fetchGoals();
      setGoals(data);
    } catch {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    try {
      await createGoal({
        title: newGoal.title,
        notes: newGoal.notes,
        deadline: newGoal.deadline || undefined
      });
      setNewGoal({ title: '', notes: '', deadline: '' });
      setShowAdd(false);
      loadGoals();
      onUpdate?.();
      triggerSakuraRain(35);
      toast.success(
        <div className="text-center">
          <span className="font-semibold block text-sm">Goal Established!</span>
          <span className="text-[11px] text-[#c9a84c] italic">初志貫徹 · Intention set</span>
        </div>,
        { className: 'zen-toast' }
      );
    } catch {
      toast.error('Failed to add goal');
    }
  };

  const handleProgress = async (id, progress) => {
    try {
      await updateGoal(id, { progress: Math.min(100, Math.max(0, progress)) });
      setGoals(prev => prev.map(g => g._id === id ? { ...g, progress } : g));
      onUpdate?.();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleProgressCommit = async (id, progress) => {
    try {
      await updateGoal(id, { progress });
      loadGoals();
      onUpdate?.();
      if (progress === 100) {
        triggerSakuraRain(50);
        toast.success(
          <div className="text-center">
            <span className="font-semibold block text-sm">Goal Finished!</span>
            <span className="text-[11px] text-[#c9a84c] italic">大願成就 · Great wish fulfilled</span>
          </div>,
          { className: 'zen-toast' }
        );
      }
    } catch {
      toast.error('Failed to save progress');
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateGoal(id, { completed: true, progress: 100 });
      loadGoals();
      onUpdate?.();
      triggerSakuraRain(55);
      toast.success(
        <div className="text-center">
          <span className="font-semibold block text-sm">Goal Accomplished!</span>
          <span className="text-[11px] text-[#c9a84c] italic">有終の美 · Graceful completion</span>
        </div>,
        { className: 'zen-toast' }
      );
    } catch {
      toast.error('Failed to complete goal');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      loadGoals();
      onUpdate?.();
    } catch {
      toast.error('Failed to delete goal');
    }
  };

  const formatDeadline = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="zen-card p-6 h-full flex flex-col justify-between min-h-[440px]"
      id="goal-tracker-section"
    >
      {/* Background Watermark - Intention (志) */}
      <div className="zen-watermark font-serif">志</div>

      <div className="z-10 w-full flex-1 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-zen-800 uppercase tracking-widest font-serif">
                Goals & Intentions
              </h2>
              <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
                目標 · {goals.filter(g => g.completed).length}/{goals.length} completed
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="zen-btn zen-btn-sm flex items-center gap-1 hover:scale-102 transition-all cursor-pointer"
              id="add-goal-btn"
            >
              <HiOutlinePlus className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdd ? 'rotate-45' : ''}`} />
              Set Intention
            </button>
          </div>

          {/* Add goal form */}
          <AnimatePresence>
            {showAdd && (
              <motion.form
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                onSubmit={handleAdd}
                className="mb-5 space-y-3 overflow-hidden bg-white/20 p-4 rounded-xl border border-white/30 backdrop-blur-sm"
              >
                <input
                  type="text"
                  placeholder="What is your central intention?"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="zen-input bg-white/40"
                  id="goal-title-input"
                  autoFocus
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Notes (optional)..."
                    value={newGoal.notes}
                    onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
                    className="zen-input flex-1 bg-white/40"
                    id="goal-notes-input"
                  />
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="zen-input w-[140px] bg-white/40 text-zen-600"
                    id="goal-deadline-input"
                  />
                </div>
                <button type="submit" className="zen-btn zen-btn-primary w-full py-2 text-xs font-semibold tracking-wider" id="goal-submit-btn">
                  Establish Intention
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Goals list */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-16 w-full" />
                ))}
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12">
                <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-3 text-zen-300">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="12 4" />
                  <path d="M12 20h16M20 12v16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-xs text-zen-400 font-serif">No active intentions. Formulate your path.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {goals.map((goal) => (
                  <motion.div
                    key={goal._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className={`group bg-white/45 backdrop-blur-md rounded-xl p-4 border border-white/50 hover:border-white/80 hover:shadow-md transition-all ${
                      goal.completed ? 'opacity-65 bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Completion Checkmark */}
                      <button
                        onClick={() => !goal.completed && handleComplete(goal._id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          goal.completed
                            ? 'bg-success border-success'
                            : 'border-zen-400 hover:border-[#c0392b] hover:bg-[#c0392b]/5'
                        }`}
                        id={`goal-complete-${goal._id}`}
                        disabled={goal.completed}
                      >
                        {goal.completed && <HiOutlineCheck className="w-3.5 h-3.5 text-white" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold font-sans text-zen-800 tracking-wide ${goal.completed ? 'line-through text-zen-400' : ''}`}>
                          {goal.title}
                        </p>
                        {goal.notes && (
                          <p className="text-[11px] text-zen-500 mt-0.5 leading-relaxed font-sans">{goal.notes}</p>
                        )}

                        {!goal.completed && (
                          <div className="flex items-center gap-3 mt-3">
                            {/* Custom visual progress bar */}
                            <div className="flex-1 h-2 bg-zen-100/50 rounded-full overflow-hidden border border-white/40 shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                className="h-full rounded-full"
                                style={{
                                  background: 'linear-gradient(90deg, #c9a84c 0%, #c0392b 100%)'
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>

                            {/* Dynamic Range Slider on Hover */}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={goal.progress}
                              onChange={(e) => handleProgress(goal._id, parseInt(e.target.value))}
                              onMouseUp={(e) => handleProgressCommit(goal._id, parseInt(e.target.value))}
                              onTouchEnd={(e) => handleProgressCommit(goal._id, parseInt(e.target.value))}
                              className="w-20 h-1 cursor-pointer transition-opacity opacity-40 group-hover:opacity-100 accent-[#c0392b]"
                              id={`goal-progress-${goal._id}`}
                              title="Drag to change progress"
                            />
                            <span className="text-[10px] text-zen-600 font-bold w-8 text-right font-sans">
                              {goal.progress}%
                            </span>
                          </div>
                        )}

                        {/* Deadline label */}
                        {goal.deadline && (
                          <div className="flex items-center gap-1 mt-2.5">
                            <span className="text-[8px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded-full border border-accent/10 uppercase tracking-widest font-sans">
                              Due {formatDeadline(goal.deadline)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="opacity-0 group-hover:opacity-100 transition-all text-zen-400 hover:text-accent cursor-pointer p-1"
                        id={`goal-delete-${goal._id}`}
                        title="Delete Goal"
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
      </div>
    </motion.div>
  );
};

export default GoalTracker;
