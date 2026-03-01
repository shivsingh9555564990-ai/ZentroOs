import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';

interface InstagramDashboardProps {
  onBack: () => void;
}

export default function InstagramDashboard({ onBack }: InstagramDashboardProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: '#0B0F1A' }}
      initial={{ x: '100%', opacity: 0.5 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.5 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full glow-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
            top: '-15%',
            right: '-10%',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full glow-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)',
            bottom: '20%',
            left: '-10%',
            animationDelay: '1.5s',
          }}
        />
      </div>

      <div className="relative z-10 px-6 safe-area-top">
        <div className="flex items-center gap-4 pt-4 pb-5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.15)',
            }}
          >
            <ArrowLeft size={18} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white tracking-tight">Instagram Dashboard</h1>
          </div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08))',
              border: '1px solid rgba(168,85,247,0.15)',
            }}
          >
            <Camera size={16} className="text-accent-instagram" />
          </div>
        </div>

        <div
          className="h-px w-full mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25), rgba(236,72,153,0.15), transparent)',
          }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.05))',
              border: '1px solid rgba(168,85,247,0.15)',
              boxShadow: '0 0 40px -10px rgba(168,85,247,0.15)',
            }}
          >
            <Camera size={32} className="text-accent-instagram" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-text-secondary max-w-[260px] leading-relaxed font-medium">
            Instagram Growth tools are being designed. AI-powered hooks, captions, and hashtag strategy launching soon.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Hook Generator', 'Caption Writer', 'Hashtag Strategy', 'Reel Ideas', 'Bio Optimizer'].map((tool, i) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium text-text-secondary"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(236,72,153,0.04))',
                  border: '1px solid rgba(168,85,247,0.12)',
                }}
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center pb-6 safe-area-bottom">
        <div className="w-32 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>
    </motion.div>
  );
}
