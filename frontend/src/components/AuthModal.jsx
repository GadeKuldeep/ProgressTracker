import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';
import { triggerSakuraRain } from './SakuraShower';

const AuthModal = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        triggerSakuraRain(40);
        toast.success(
          <div className="text-center">
            <span className="font-semibold block text-sm text-[#fafaf7]">Welcome Back!</span>
            <span className="text-[11px] text-[#c9a84c] italic">お帰りなさい · Welcome back</span>
          </div>,
          { className: 'zen-toast' }
        );
      } else {
        await register(form.name, form.email, form.password);
        triggerSakuraRain(50);
        toast.success(
          <div className="text-center">
            <span className="font-semibold block text-sm">Account Created!</span>
            <span className="text-[11px] text-[#c9a84c] italic">ようこそ · Hearty welcome</span>
          </div>,
          { className: 'zen-toast' }
        );
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Frosted glass backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a1a]/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Floating Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative zen-card w-full max-w-[390px] p-8 md:p-10 border border-white/60 bg-[#fafaf7]/85 backdrop-blur-lg shadow-2xl overflow-hidden"
      >
        {/* Background Watermark - Harmony (和) */}
        <div className="zen-watermark font-serif">和</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zen-400 hover:text-accent transition-colors cursor-pointer p-1"
          id="auth-close-btn"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>

        {/* Form Title */}
        <div className="text-center mb-6 z-10 relative">
          <h2 className="text-xl font-semibold text-zen-800 font-serif tracking-wider">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-[10px] text-accent uppercase tracking-widest font-bold font-sans mt-0.5">
            {isLogin ? '心をつなぐ · Continue Your Path' : '新たな一歩 · Begin Your Journey'}
          </p>
        </div>

        {/* Inputs form */}
        <form onSubmit={handleSubmit} className="space-y-4 z-10 relative">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="zen-input"
                  required={!isLogin}
                  id="auth-name"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="zen-input"
            required
            id="auth-email"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="zen-input"
            required
            minLength={6}
            id="auth-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="zen-btn zen-btn-primary w-full py-3 text-sm font-semibold tracking-wider mt-2.5"
            id="auth-submit"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-[#fafaf7]/35 border-t-[#fafaf7] rounded-full"
              />
            ) : (
              isLogin ? 'Enter calm space' : 'Initiate presence'
            )}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <div className="mt-6 text-center z-10 relative border-t border-zen-200/40 pt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zen-500 hover:text-accent font-semibold transition-all cursor-pointer font-sans"
            id="auth-toggle"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
