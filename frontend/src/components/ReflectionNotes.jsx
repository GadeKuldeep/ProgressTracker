import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchReflections, createReflection, deleteReflection } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const moods = [
  { value: 'peaceful', emoji: '🍃', label: 'Peaceful', colorBg: 'rgba(122, 158, 126, 0.15)', colorBorder: '#7a9e7e', colorText: '#4e6d51' },
  { value: 'focused', emoji: '🎯', label: 'Focused', colorBg: 'rgba(192, 57, 43, 0.12)', colorBorder: '#c0392b', colorText: '#a0281b' },
  { value: 'grateful', emoji: '🌸', label: 'Grateful', colorBg: 'rgba(235, 179, 201, 0.25)', colorBorder: '#db87a7', colorText: '#b25777' },
  { value: 'thoughtful', emoji: '💭', label: 'Thoughtful', colorBg: 'rgba(141, 153, 174, 0.2)', colorBorder: '#718096', colorText: '#4a5568' },
  { value: 'energized', emoji: '⚡', label: 'Energized', colorBg: 'rgba(201, 168, 76, 0.18)', colorBorder: '#c9a84c', colorText: '#997b2f' },
  { value: 'calm', emoji: '🌊', label: 'Calm', colorBg: 'rgba(137, 189, 196, 0.25)', colorBorder: '#6ca8b0', colorText: '#3a7279' }
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

  const getMoodConfig = (m) => moods.find(x => x.value === m) || moods[5];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="zen-card p-6 h-full flex flex-col justify-between min-h-[440px]"
      id="reflection-section"
    >
      {/* Background Watermark - Reflection (省) */}
      <div className="zen-watermark font-serif">省</div>

      <div className="z-10 w-full flex-1 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zen-800 uppercase tracking-widest font-serif">
              Reflections Journal
            </h2>
            <p className="text-[10px] text-zen-400 font-serif italic mt-0.5">
              静思録 · Capture your thoughts peacefully
            </p>
          </div>

          {/* Write box */}
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is present in your heart today? Reflect freely..."
              className="zen-input min-h-[90px] resize-none text-sm leading-relaxed bg-white/45 focus:bg-white/80"
              id="reflection-textarea"
            />

            {/* Mood selection and action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
              <div className="flex gap-2 flex-wrap">
                {moods.map((m) => {
                  const isActive = mood === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      style={{
                        backgroundColor: isActive ? m.colorBg : 'rgba(255, 255, 255, 0.4)',
                        borderColor: isActive ? m.colorBorder : 'rgba(168, 159, 145, 0.2)',
                        color: isActive ? m.colorText : '#7a7065'
                      }}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
                      title={m.label}
                      id={`mood-${m.value}`}
                      type="button"
                    >
                      {m.emoji}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="zen-btn zen-btn-primary zen-btn-sm self-end sm:self-auto hover:scale-102 cursor-pointer"
                id="reflection-save-btn"
              >
                {saving ? 'Recording...' : 'Record Reflection'}
              </button>
            </div>
          </div>

          {/* Divider SVG line */}
          <div className="my-4 opacity-40">
            <svg viewBox="0 0 100 2" className="w-full h-[3px]">
              <path d="M 0 1 C 30 0.5, 70 1.5, 100 1" stroke="#c9a84c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Saved journals */}
          <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
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
              <AnimatePresence initial={false}>
                {reflections.map((ref) => {
                  const mConfig = getMoodConfig(ref.mood);
                  return (
                    <motion.div
                      key={ref._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      style={{ borderLeftColor: mConfig.colorBorder }}
                      className="group bg-white/45 backdrop-blur-md rounded-xl p-3.5 hover:bg-white/60 transition-all border border-white/50 hover:border-white/80 border-l-[3.5px] hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          style={{
                            backgroundColor: mConfig.colorBg,
                            borderColor: mConfig.colorBorder
                          }}
                          className="text-base p-1 rounded-lg border flex items-center justify-center shadow-inner shrink-0"
                          title={mConfig.label}
                        >
                          {mConfig.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-sans text-zen-700 leading-relaxed font-medium">
                            {ref.content}
                          </p>
                          <p className="text-[9px] font-bold text-accent uppercase tracking-wider mt-2 font-sans">
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
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReflectionNotes;
