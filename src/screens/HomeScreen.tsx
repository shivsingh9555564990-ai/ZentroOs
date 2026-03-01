import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedPressableCard from '../components/AnimatedPressableCard';
import ModelSelector from '../components/ModelSelector';
import { ChevronRight, Play, Camera } from 'lucide-react';
import type { User } from '../services/auth';

interface HomeScreenProps {
  user: User;
}

export default function HomeScreen({ user }: HomeScreenProps) {
  const navigate = useNavigate();
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', top: '-10%', right: '-20%' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.04) 0%, transparent 70%)', bottom: '10%', left: '-15%', animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="px-6 safe-area-top">
          <motion.div className="flex items-center justify-between pt-4 pb-3"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(168,85,247,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="url(#h-bolt)" />
                  <defs><linearGradient id="h-bolt" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A855F7" /><stop offset="1" stopColor="#EC4899" />
                  </linearGradient></defs>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">CreatorOS</h1>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white/10 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </motion.button>
          </motion.div>

          <motion.div className="h-px w-full mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), rgba(236,72,153,0.2), transparent)' }}
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />

          <motion.div className="mb-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-sm text-text-secondary font-medium">
              Welcome back, <span className="text-white font-semibold">{user.name.split(' ')[0]}</span> 👋
            </p>
          </motion.div>

          <ModelSelector />

          <motion.div className="mb-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-[28px] leading-[1.15] font-extrabold tracking-tight mb-2"
              style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.85) 50%, rgba(168,85,247,0.9) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Growth OS{'\n'}
              <span style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(168,85,247,0.8))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>for Creators</span>
            </h2>
            <p className="text-text-secondary text-[14px] font-medium tracking-wide">Optimize · Analyze · Scale</p>
          </motion.div>

          <motion.div className="glass rounded-2xl px-4 py-2.5 mb-5 flex items-center gap-3"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
              <span className="text-[11px] font-medium text-text-secondary">AI Online</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5">
              {[3,4,3.5,5,3].map((h,i) => (
                <div key={i} className="rounded-full bg-accent-instagram" style={{ width: 3, height: h*3.5, opacity: 0.5+i*0.1 }} />
              ))}
            </div>
            <span className="text-[11px] font-medium text-text-secondary ml-1">Active</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.42 }}>
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest mb-3.5 px-1">Growth Suites</p>
          </motion.div>

          <AnimatedPressableCard glowColor="rgba(255, 59, 48, 0.12)" borderGlowColor="rgba(255, 59, 48, 0.2)"
            onTap={() => navigate('/youtube')} delay={0.45} className="mb-4">
            <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(255,59,48,0.06) 0%, transparent 100%)' }} />
            <div className="relative p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(255,59,48,0.15), rgba(255,59,48,0.05))',
                  border: '1px solid rgba(255,59,48,0.2)', boxShadow: '0 0 24px -6px rgba(255,59,48,0.2)' }}>
                <Play size={22} className="text-accent-youtube ml-0.5" fill="rgba(255,59,48,0.3)" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-white tracking-tight">YouTube Growth Suite</h3>
                <p className="text-sm text-text-secondary mt-0.5 font-medium">Titles · Descriptions · Tags</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.15)' }}>
                <ChevronRight size={16} className="text-accent-youtube" />
              </div>
            </div>
            <div className="h-px mx-5" style={{ background: 'linear-gradient(90deg, rgba(255,59,48,0.3), rgba(255,59,48,0.05), transparent)' }} />
            <div className="px-5 py-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-youtube opacity-60" />
                <span className="text-[11px] text-text-secondary font-medium">3 AI Tools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" />
                <span className="text-[11px] text-text-secondary font-medium">AI Powered</span>
              </div>
              <div className="flex-1" />
              <span className="text-[11px] text-accent-youtube font-semibold opacity-80">Explore →</span>
            </div>
          </AnimatedPressableCard>

          <AnimatedPressableCard glowColor="rgba(168, 85, 247, 0.12)" borderGlowColor="rgba(168, 85, 247, 0.2)"
            onTap={() => navigate('/instagram')} delay={0.55} className="mb-8">
            <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.06) 0%, transparent 100%)' }} />
            <div className="relative p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))',
                  border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 24px -6px rgba(168,85,247,0.2)' }}>
                <Camera size={22} className="text-accent-instagram" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-bold text-white tracking-tight">Instagram Growth Suite</h3>
                <p className="text-sm text-text-secondary mt-0.5 font-medium">Captions · Hashtags · Bios</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                <ChevronRight size={16} className="text-accent-instagram" />
              </div>
            </div>
            <div className="h-px mx-5" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.3), rgba(236,72,153,0.1), transparent)' }} />
            <div className="px-5 py-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-instagram opacity-60" />
                <span className="text-[11px] text-text-secondary font-medium">3 AI Tools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" />
                <span className="text-[11px] text-text-secondary font-medium">AI Powered</span>
              </div>
              <div className="flex-1" />
              <span className="text-[11px] text-accent-instagram font-semibold opacity-80">Explore →</span>
            </div>
          </AnimatedPressableCard>

          <div className="h-24 safe-area-bottom" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none safe-area-bottom">
        <div className="flex justify-center pb-2 pt-4" style={{ background: 'linear-gradient(180deg, transparent, rgba(11,15,26,0.95))' }}>
          <div className="w-32 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    </motion.div>
  );
}
