import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, initError } from './firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
  provider?: string;
}

function firebaseToUser(fb: FirebaseUser): User {
  return {
    id: fb.uid,
    name: fb.displayName || fb.email?.split('@')[0] || 'Creator',
    email: fb.email || '',
    createdAt: fb.metadata.creationTime || new Date().toISOString(),
    avatar: fb.photoURL || undefined,
    provider: fb.providerData?.[0]?.providerId || 'password',
  };
}

function getFriendlyError(err: unknown): string {
  const e = err as { code?: string; message?: string };
  const code = e.code || '';
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
    'auth/weak-password': 'Password too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/invalid-login-credentials': 'Invalid email or password. Please check and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a minute and try again.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in cancelled.',
    'auth/popup-blocked': 'Popup blocked by browser. Please allow popups and try again.',
    'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/internal-error': 'Something went wrong. Please try again.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/requires-recent-login': 'Please sign in again to continue.',
    'auth/unauthorized-domain': 'Domain not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.',
  };
  return map[code] || e.message || 'Something went wrong. Please try again.';
}

const SETTINGS_KEY = 'creatoros_settings';

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  hapticFeedback: boolean;
  autoSave: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  darkMode: true,
  language: 'English',
  hapticFeedback: true,
  autoSave: true,
  compactMode: false,
};

export const authService = {
  isAvailable(): boolean {
    return auth !== null && initError === null;
  },

  getInitError(): string | null {
    return initError;
  },

  async signUp(
    name: string, email: string, password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!auth) return { success: false, error: 'Firebase not available. Please refresh the page.' };

    const trimName = name.trim();
    const trimEmail = email.trim().toLowerCase();

    if (!trimName || trimName.length < 2) return { success: false, error: 'Name must be at least 2 characters' };
    if (!trimEmail || !trimEmail.includes('@') || !trimEmail.includes('.')) return { success: false, error: 'Please enter a valid email address' };
    if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    try {
      const cred = await createUserWithEmailAndPassword(auth, trimEmail, password);
      try { await updateProfile(cred.user, { displayName: trimName }); } catch {}
      const user = firebaseToUser(cred.user);
      user.name = trimName;
      return { success: true, user };
    } catch (err) {
      return { success: false, error: getFriendlyError(err) };
    }
  },

  async signIn(
    email: string, password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!auth) return { success: false, error: 'Firebase not available. Please refresh the page.' };

    const trimEmail = email.trim().toLowerCase();
    if (!trimEmail) return { success: false, error: 'Please enter your email' };
    if (!password) return { success: false, error: 'Please enter your password' };

    try {
      const cred = await signInWithEmailAndPassword(auth, trimEmail, password);
      return { success: true, user: firebaseToUser(cred.user) };
    } catch (err) {
      return { success: false, error: getFriendlyError(err) };
    }
  },

  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!auth || !googleProvider) return { success: false, error: 'Firebase not available. Please refresh the page.' };

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      return { success: true, user: firebaseToUser(cred.user) };
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Google sign-in was cancelled. Try again.' };
      }
      return { success: false, error: getFriendlyError(err) };
    }
  },

  onAuthChange(callback: (user: User | null) => void): () => void {
    if (!auth) {
      setTimeout(() => callback(null), 100);
      return () => {};
    }
    try {
      return onAuthStateChanged(auth, (fb) => {
        callback(fb ? firebaseToUser(fb) : null);
      });
    } catch {
      setTimeout(() => callback(null), 100);
      return () => {};
    }
  },

  async signOut(): Promise<void> {
    if (!auth) return;
    try { await firebaseSignOut(auth); } catch {}
  },

  async updateName(newName: string): Promise<boolean> {
    if (!auth || !auth.currentUser) return false;
    try {
      await updateProfile(auth.currentUser, { displayName: newName.trim() });
      return true;
    } catch { return false; }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)); } catch {}
    return updated;
  },

  getStats() {
    try {
      const data = localStorage.getItem('creatoros_usage');
      return data ? JSON.parse(data) : { totalGenerations: 0, toolsUsed: 6, savedResults: 0 };
    } catch { return { totalGenerations: 0, toolsUsed: 6, savedResults: 0 }; }
  },

  incrementGeneration() {
    try {
      const stats = this.getStats();
      stats.totalGenerations += 1;
      localStorage.setItem('creatoros_usage', JSON.stringify(stats));
    } catch {}
  },
};
