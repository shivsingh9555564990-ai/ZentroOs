import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
  onClick?: () => void;
}

export default function GradientButton({ 
  children, 
  className, 
  from = '#A855F7', 
  to = '#EC4899', 
  onClick 
}: GradientButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'px-6 py-3 rounded-2xl font-semibold text-white text-sm',
        'shadow-lg transition-shadow duration-300',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        boxShadow: `0 8px 32px -8px ${from}66`
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
