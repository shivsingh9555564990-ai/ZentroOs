import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import YouTubeDashboard from './screens/YouTubeDashboard';
import InstagramDashboard from './screens/InstagramDashboard';

type Screen = 'splash' | 'home' | 'youtube' | 'instagram';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const handleSplashFinish = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  return (
    <div
      className="w-full h-full overflow-hidden select-none"
      style={{
        background: '#0B0F1A',
        maxWidth: '100vw',
        maxHeight: '100vh',
        touchAction: 'manipulation',
      }}
    >
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <SplashScreen key="splash" onFinish={handleSplashFinish} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen key="home" onNavigate={handleNavigate} />
        )}
        {currentScreen === 'youtube' && (
          <YouTubeDashboard key="youtube" onBack={handleBack} />
        )}
        {currentScreen === 'instagram' && (
          <InstagramDashboard key="instagram" onBack={handleBack} />
        )}
      </AnimatePresence>
    </div>
  );
}
