import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';

interface YouTubeDashboardProps {
  onBack: () => void;
}

export default function YouTubeDashboard({ onBack }: YouTubeDashboardProps) {
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
            background: 'radial-gradient(circle, rgba(255,59,48,0.06) 0%, transparent 70%)',
            top: '-15%',
            right: '-10%',
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
              background: 'rgba(255,59,48,0.08)',
              border: '1px solid rgba(255,59,48,0.15)',
            }}
          >
            <ArrowLeft size={18} className="text-white" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white tracking-tight">YouTube Dashboard</h1>
          </div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255,59,48,0.08)',
              border: '1px solid rgba(255,59,48,0.15)',
            }}
          >
            <Play size={16} className="text-accent-youtube ml-0.5" fill="rgba(255,59,48,0.3)" />
          </div>
        </div>

        <div
          className="h-px w-full mb-8"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,59,48,0.25), transparent)',
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
              background: 'linear-gradient(135deg, rgba(255,59,48,0.1), rgba(255,59,48,0.03))',
              border: '1px solid rgba(255,59,48,0.15)',
              boxShadow: '0 0 40px -10px rgba(255,59,48,0.15)',
            }}
          >
            <Play size={32} className="text-accent-youtube ml-1" fill="rgba(255,59,48,0.2)" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
          <p className="text-sm text-text-secondary max-w-[260px] leading-relaxed font-medium">
            YouTube Growth tools are being crafted. AI-powered titles, topics, and retention analysis coming in the next update.
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Title Generator', 'Topic Research', 'Retention Analyzer', 'Thumbnail AI', 'SEO Optimizer', 'Script Writer'].map((tool, i) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium text-text-secondary"
                style={{
                  background: 'rgba(255,59,48,0.06)',
                  border: '1px solid rgba(255,59,48,0.12)',
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
