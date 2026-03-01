import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ChevronRight, MessageSquare, Hash, User } from 'lucide-react';
import { getToolsByPlatform } from '../tools/toolConfig';
import AnimatedPressableCard from '../components/AnimatedPressableCard';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { MessageSquare, Hash, User };

export default function InstagramDashboard() {
  const navigate = useNavigate();
  const tools = getToolsByPlatform('instagram');

  return (
    <motion.div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}
      initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0.5 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', top: '-15%', right: '-10%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)', bottom: '20%', left: '-10%', animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="px-6 safe-area-top">
          <div className="flex items-center gap-4 pt-4 pb-5">
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
              <ArrowLeft size={18} className="text-white" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white tracking-tight">Instagram Suite</h1>
              <p className="text-xs text-text-secondary mt-0.5">AI-powered content tools</p>
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08))', border: '1px solid rgba(168,85,247,0.15)' }}>
              <Camera size={16} className="text-accent-instagram" />
            </div>
          </div>

          <div className="h-px w-full mb-6"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25), rgba(236,72,153,0.15), transparent)' }} />

          <motion.div className="mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-5"
              style={{ borderColor: 'rgba(168,85,247,0.12)', boxShadow: '0 0 40px -10px rgba(168,85,247,0.1)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent-instagram" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.5)' }} />
                <span className="text-xs font-semibold text-accent-instagram uppercase tracking-wider">Instagram Growth</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Create engaging captions, strategic hashtag sets, and optimized bios with AI.
              </p>
            </div>
          </motion.div>

          <motion.p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4 px-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>AI Tools</motion.p>

          {tools.map((tool, i) => {
            const IconComp = iconMap[tool.icon] || MessageSquare;
            return (
              <AnimatedPressableCard key={tool.id} glowColor="rgba(168, 85, 247, 0.1)" borderGlowColor="rgba(168, 85, 247, 0.18)"
                onTap={() => navigate(`/tool/instagram/${tool.id}`)} delay={0.35 + i * 0.1} className="mb-3">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.06))', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <IconComp size={20} className="text-accent-instagram" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-white tracking-tight">{tool.name}</h3>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{tool.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-text-secondary flex-shrink-0" />
                </div>
              </AnimatedPressableCard>
            );
          })}
          <div className="h-24 safe-area-bottom" />
        </div>
      </div>
    </motion.div>
  );
}
