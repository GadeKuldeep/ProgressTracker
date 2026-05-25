import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchReflections, createReflection, deleteReflection } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const moods = [
  { value: 'peaceful', emoji: '🍃', label: 'Peaceful' },
  { value: 'focused', emoji: '🎯', label: 'Focused' },
  { value: 'grateful', emoji: '🌸', label: 'Grateful' },
  { value: 'thoughtful', emoji: '💭', label: 'Thoughtful' },
  { value: 'energized', emoji: '⚡', label: 'Energized' },
  { value: 'calm', emoji: '🌊', label: 'Calm' }
];

const ReflectionNotes = () => {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('calm');
  const [saving, setSaving] = useState(false);

  const loadReflections = async () => {
    try {
      const { data } = await fetchReflections(10);
      setReflections(data);
    } catch {
      toast.error('Failed to load reflections');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadReflections();
  }, []);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await createReflection({
        content,
        mood,
        date: new Date().toISOString().split('T')[0]
      });
      setContent('');
      setMood('calm');
      loadReflections();
      triggerSakuraRain(35);
      toast.success(
        <div className="text-center">
          <span className="font-semibold block text-sm">Reflection Recorded!</span>
          <span className="text-[11px] text-[#c9a84c] italic">省みる · Reflected in quiet mind</span>
        </div>,
        { className: 'zen-toast' }
      );
    } catch {
      toast.error('Failed to save reflection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReflection(id);
      loadReflections();
    } catch {
      toast.error('Failed to delete reflection');
    }
  };

  const getMoodEmoji = (m) => moods.find(x => x.value === m)?.emoji || '🌊';
  const getMoodLabel = (m) => moods.find(x => x.value === m)?.label || 'Calm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="zen-card p-6 h-full flex flex-col justify-between"
      id="reflection-section"
    >
      {/* Background Watermark - Reflection (省) */}
      <div className="zen-watermark font-serif">省</div>

      <div className="z-10 w-full">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-zen-800 uppercase tracking-widest font-serif">
            Reflections Journal
          </h2>
          <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
            静思録 · Capture your thoughts peacefully
          </p>
        </div>

        {/* Write box */}
        <div className="mb-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is present in your heart today? Reflect freely..."
            className="zen-input min-h-[90px] resize-none text-sm leading-relaxed"
            id="reflection-textarea"
          />

          {/* Mood selection and action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`mood-select-btn ${mood === m.value ? 'active' : ''}`}
                  title={m.label}
                  id={`mood-${m.value}`}
                  type="button"
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className="zen-btn zen-btn-primary zen-btn-sm self-end sm:self-auto"
              id="reflection-save-btn"
            >
              {saving ? 'Recording...' : 'Record Reflection'}
            </button>
          </div>
        </div>

        {/* Divider SVG line */}
        <svg viewBox="0 0 100 2" className="brush-divider">
          <path d="M 0 1 C 30 0.5, 70 1.5, 100 1" strokeWidth="0.8" strokeLinecap="round" />
        </svg>

        {/* Saved journals */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : reflections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-zen-400 font-serif">The journal is empty. Reflect on your journey.</p>
            </div>
          ) : (
            <AnimatePresence>
              {reflections.map((ref) => (
                <motion.div
                  key={ref._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group bg-white/45 backdrop-blur-md rounded-xl p-3.5 hover:bg-white/60 transition-all border border-white/50 hover:border-white/80"
                >
                  <div className="flex items-start gap-3">
                    <span 
                      className="text-lg p-1.5 rounded-lg bg-white/60 border border-white flex items-center justify-center shadow-inner"
                      title={getMoodLabel(ref.mood)}
                    >
                      {getMoodEmoji(ref.mood)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans text-zen-700 leading-relaxed font-medium">
                        {ref.content}
                      </p>
                      <p className="text-[9px] font-semibold text-accent uppercase tracking-wider mt-1.5 font-sans">
                        {new Date(ref.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(ref._id)}
                      className="opacity-0 group-hover:opacity-100 transition-all text-zen-400 hover:text-accent cursor-pointer p-1"
                      id={`reflection-delete-${ref._id}`}
                      title="Delete Journal Entry"
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

export default ReflectionNotes;
