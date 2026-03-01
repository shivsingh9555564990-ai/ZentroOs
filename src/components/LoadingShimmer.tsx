import { motion } from 'framer-motion';

interface LoadingShimmerProps {
  accentColor?: string;
}

export default function LoadingShimmer({ accentColor = '#A855F7' }: LoadingShimmerProps) {
  return (
    <div className="space-y-3 w-full">
      {[1, 0.7, 0.85, 0.6, 0.9, 0.5].map((width, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
          className="shimmer-loader rounded-lg"
          style={{ width: `${width * 100}%`, height: '14px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
            backgroundSize: '200% 100%' }} />
      ))}
      <div className="flex items-center justify-center gap-2 pt-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-5 h-5 rounded-full border-2 border-transparent"
          style={{ borderTopColor: accentColor, borderRightColor: `${accentColor}44` }} />
        <span className="text-xs font-medium" style={{ color: accentColor }}>AI is generating...</span>
      </div>
    </div>
  );
}
