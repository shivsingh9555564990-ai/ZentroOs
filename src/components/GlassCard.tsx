import { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className, glowColor, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[20px] glass overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={glowColor ? {
        boxShadow: `0 0 40px -10px ${glowColor}, inset 0 1px 0 0 rgba(255,255,255,0.06)`
      } : {
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06)'
      }}
    >
      {children}
    </div>
  );
}
