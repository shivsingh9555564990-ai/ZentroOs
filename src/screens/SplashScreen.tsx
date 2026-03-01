import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const calledRef = useRef(false);

  useEffect(() => {
    const totalDuration = 1000;
    const steps = 50;
    const interval = totalDuration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / steps;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setProgress(100);
        if (!calledRef.current) {
          calledRef.current = true;
          setTimeout(() => onFinish(), 150);
        }
      } else {
        setProgress(Math.round(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0B0F1A' }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
            top: '55%',
            left: '60%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '0.5s',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div
          className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
            border: '1px solid rgba(168,85,247,0.3)',
            boxShadow: '0 0 40px -10px rgba(168,85,247,0.4)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="url(#bolt-gradient)" />
            <defs>
              <linearGradient id="bolt-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CreatorOS
        </h1>

        <p
          className="text-sm mt-2 font-medium tracking-wide"
          style={{ color: '#9CA3AF' }}
        >
          Your AI Growth Engine
        </p>

        <div className="mt-10 flex flex-col items-center w-48">
          <div className="mb-3 flex items-baseline gap-0.5">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{
                background: progress === 100
                  ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                  : 'linear-gradient(90deg, #A855F7, #EC4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {progress}
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                color: progress === 100 ? '#22C55E' : '#A855F7',
                transition: 'color 0.2s ease',
              }}
            >
              %
            </span>
          </div>

          <div
            className="w-full h-[4px] rounded-full overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${progress}%`,
                background: progress === 100
                  ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                  : 'linear-gradient(90deg, #A855F7, #EC4899)',
                transition: 'width 0.05s linear, background 0.2s ease',
                boxShadow: progress === 100
                  ? '0 0 12px rgba(34,197,94,0.5)'
                  : '0 0 12px rgba(168,85,247,0.5)',
              }}
            />
          </div>

          <p
            className="text-xs mt-3 font-medium"
            style={{
              color: progress === 100 ? '#4ADE80' : '#6B7280',
              transition: 'color 0.2s ease',
            }}
          >
            {progress < 30
              ? 'Initializing...'
              : progress < 60
              ? 'Loading modules...'
              : progress < 90
              ? 'Preparing dashboard...'
              : progress < 100
              ? 'Almost ready...'
              : '✓ Ready'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
