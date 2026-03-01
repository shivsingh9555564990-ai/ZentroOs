import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface AnimatedPressableCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderGlowColor?: string;
  onTap?: () => void;
  delay?: number;
}

export default function AnimatedPressableCard({ 
  children, 
  className, 
  glowColor = 'rgba(168,85,247,0.15)',
  borderGlowColor = 'rgba(168,85,247,0.25)',
  onTap,
  delay = 0 
}: AnimatedPressableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onTap={onTap}
      className={cn(
        'relative rounded-[20px] overflow-hidden cursor-pointer select-none',
        'active:brightness-90 transition-[filter] duration-100',
        className
      )}
      style={{
        background: 'rgba(17, 24, 39, 0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${borderGlowColor}`,
        boxShadow: `0 0 60px -15px ${glowColor}, 0 8px 32px -8px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.06)`,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
        }}
        whileTap={{ opacity: 1, transition: { duration: 0.15 } }}
      />
      {children}
    </motion.div>
  );
}
