import { useState, useCallback, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import YouTubeDashboard from './screens/YouTubeDashboard';
import InstagramDashboard from './screens/InstagramDashboard';
import ToolPage from './screens/ToolPage';
import ProfileScreen from './screens/ProfileScreen';
import ToastContainer from './components/Toast';
import { authService } from './services/auth';
import type { User } from './services/auth';

function AnimatedRoutes({ user, onLogout }: { user: User; onLogout: () => void }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeScreen user={user} />} />
        <Route path="/youtube" element={<YouTubeDashboard />} />
        <Route path="/instagram" element={<InstagramDashboard />} />
        <Route path="/tool/:platform/:toolId" element={<ToolPage />} />
        <Route path="/profile" element={<ProfileScreen user={user} onLogout={onLogout} />} />
      </Routes>
    </AnimatePresence>
  );
}

type Screen = 'splash' | 'auth' | 'app';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  // Firebase auth listener — fires when user signs in/out
  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      unsub = authService.onAuthChange((u) => {
        userRef.current = u;
        if (u) {
          setUser(u);
          // Auto-redirect to app if we're on auth screen
          setScreen((prev) => (prev === 'auth' ? 'app' : prev));
        } else {
          setUser(null);
        }
      });
    } catch {
      // Firebase failed — no auto-login, that's OK
    }
    return () => { if (unsub) unsub(); };
  }, []);

  // When splash finishes → ALWAYS go somewhere (never stay stuck)
  const handleSplashFinish = useCallback(() => {
    // If Firebase already found a user, go straight to app
    if (userRef.current) {
      setUser(userRef.current);
      setScreen('app');
    } else {
      // No user found (or Firebase slow/failed) → show auth
      setScreen('auth');
    }
  }, []);

  const handleAuth = useCallback((u: User) => {
    userRef.current = u;
    setUser(u);
    setScreen('app');
  }, []);

  const handleLogout = useCallback(async () => {
    try { await authService.signOut(); } catch {}
    userRef.current = null;
    setUser(null);
    setScreen('auth');
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
      {screen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {screen === 'auth' && (
        <AuthScreen onAuth={handleAuth} />
      )}

      {screen === 'app' && user && (
        <HashRouter>
          <AnimatedRoutes user={user} onLogout={handleLogout} />
          <ToastContainer />
        </HashRouter>
      )}
    </div>
  );
}
