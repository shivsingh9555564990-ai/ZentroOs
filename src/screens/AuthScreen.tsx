import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Sparkles, AlertTriangle } from 'lucide-react';
import { authService } from '../services/auth';
import type { User as UserType } from '../services/auth';

interface AuthScreenProps { onAuth: (user: UserType) => void; }

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const anyLoading = loading || googleLoading;

  const handleSubmit = async () => {
    if (anyLoading) return;
    setError('');
    setLoading(true);
    try {
      const res = mode === 'signup'
        ? await authService.signUp(name, email, password)
        : await authService.signIn(email, password);
      if (res.success && res.user) { onAuth(res.user); }
      else { setError(res.error || 'Authentication failed'); }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    if (anyLoading) return;
    setError('');
    setGoogleLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.user) { onAuth(res.user); }
      else { setError(res.error || 'Google sign-in failed'); }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    }
    setGoogleLoading(false);
  };

  const switchMode = () => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setName(''); setEmail(''); setPassword(''); };

  const isValid = mode === 'signup'
    ? name.trim().length >= 2 && email.includes('@') && email.includes('.') && password.length >= 6
    : email.includes('@') && password.length >= 1;

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /\d/.test(password) ? 4 : 3;
  const pwColors = ['', '#EF4444', '#F59E0B', '#10B981', '#06B6D4'];
  const pwLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', top: '-5%', left: '50%', transform: 'translateX(-50%)', animation: 'glow-pulse 4s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', bottom: '5%', right: '-10%', animation: 'glow-pulse 4s ease-in-out infinite 1.5s' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', bottom: '30%', left: '-15%', animation: 'glow-pulse 4s ease-in-out infinite 2.5s' }} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-7 py-8 safe-area-top safe-area-bottom">
          <motion.div className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
                border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 0 50px -10px rgba(168,85,247,0.4)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="url(#auth-bolt)" />
                <defs><linearGradient id="auth-bolt" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" /><stop offset="0.5" stopColor="#A855F7" /><stop offset="1" stopColor="#EC4899" />
                </linearGradient></defs>
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight"
              style={{ background: 'linear-gradient(135deg, #FFFFFF, rgba(255,255,255,0.8), rgba(168,85,247,0.9))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CreatorOS</h1>
            <p className="text-sm text-text-secondary mt-1.5 font-medium">AI Growth OS for Creators</p>
          </motion.div>

          <motion.div className="flex gap-1 p-1 rounded-2xl mb-6 mx-auto w-full max-w-[280px]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {(['signin', 'signup'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{ background: mode === m ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))' : 'transparent',
                  color: mode === m ? '#fff' : '#6B7280',
                  border: mode === m ? '1px solid rgba(168,85,247,0.25)' : '1px solid transparent' }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </motion.div>

          <motion.div className="rounded-[24px] overflow-hidden"
            style={{ background: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 60px -15px rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-1">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-sm text-text-secondary mb-5">{mode === 'signin' ? 'Sign in to access your tools' : 'Start your growth journey'}</p>

              <motion.button whileTap={{ scale: anyLoading ? 1 : 0.97 }} onClick={handleGoogle} disabled={anyLoading}
                className="w-full py-3.5 rounded-2xl font-semibold text-[14px] text-white flex items-center justify-center gap-3 mb-5 disabled:opacity-40 transition-opacity"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {googleLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-transparent border-t-white border-r-white/40" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </motion.button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={mode}
                  initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3.5">

                  {mode === 'signup' && (
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} disabled={anyLoading}
                        className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-[14px] text-white placeholder-gray-500 font-medium outline-none transition-all duration-200 disabled:opacity-40"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#A855F7' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={anyLoading}
                      className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-[14px] text-white placeholder-gray-500 font-medium outline-none transition-all duration-200 disabled:opacity-40"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#A855F7' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password}
                      onChange={e => setPassword(e.target.value)} disabled={anyLoading}
                      className="w-full py-3.5 pl-11 pr-12 rounded-2xl text-[14px] text-white placeholder-gray-500 font-medium outline-none transition-all duration-200 disabled:opacity-40"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', caretColor: '#A855F7' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      onKeyDown={e => e.key === 'Enter' && isValid && handleSubmit()} />
                    <button onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary" disabled={anyLoading}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {mode === 'signup' && password.length > 0 && (
                    <div className="px-1">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{ background: pwStrength >= i ? pwColors[pwStrength] : 'rgba(255,255,255,0.06)' }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: pwColors[pwStrength] || '#6B7280' }}>{pwLabels[pwStrength]}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }}
                    className="mt-4 px-4 py-3 rounded-xl text-[13px] font-medium text-red-400 flex items-start gap-2.5"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button whileTap={{ scale: anyLoading ? 1 : 0.97 }} onClick={handleSubmit} disabled={anyLoading || !isValid}
                className="w-full mt-5 py-4 rounded-2xl font-bold text-[15px] text-white flex items-center justify-center gap-2.5 disabled:opacity-30 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                  boxShadow: isValid && !anyLoading ? '0 8px 32px -6px rgba(168,85,247,0.5)' : 'none' }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 rounded-full border-2 border-transparent border-t-white border-r-white/40" />
                    <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <><Sparkles size={16} /><span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span><ArrowRight size={16} /></>
                )}
              </motion.button>
            </div>

            <div className="px-6 py-4 flex items-center justify-center gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-sm text-text-secondary">{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</span>
              <button onClick={switchMode} className="text-sm font-bold" style={{ color: '#A855F7' }}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </motion.div>

          <motion.div className="flex items-center justify-center gap-2 mt-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Lock size={10} className="text-text-secondary/40" />
            <p className="text-[10px] text-text-secondary/40 font-medium">256-bit encrypted • Firebase secured</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
