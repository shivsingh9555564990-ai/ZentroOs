import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  hapticFeedback: boolean;
  autoSave: boolean;
  compactMode: boolean;
}

const SETTINGS_KEY = 'creatoros_settings';
const STATS_KEY = 'creatoros_stats';

function firebaseUserToUser(fbUser: import('firebase/auth').User): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Creator',
    email: fbUser.email || '',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    avatar: fbUser.photoURL || undefined,
  };
}

function getFriendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/invalid-login-credentials': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/unauthorized-domain': 'This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.',
    'auth/requires-recent-login': 'Please sign out and sign in again to perform this action.',
    'auth/internal-error': 'An internal error occurred. Please try again.',
  };
  return map[code] || `Authentication error: ${code}`;
}

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const trimName = name.trim();
      const trimEmail = email.trim().toLowerCase();
      if (!trimName || trimName.length < 2) return { success: false, error: 'Name must be at least 2 characters' };
      if (!trimEmail || !trimEmail.includes('@') || !trimEmail.includes('.')) return { success: false, error: 'Please enter a valid email' };
      if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

      const cred = await createUserWithEmailAndPassword(auth, trimEmail, password);
      await updateProfile(cred.user, { displayName: trimName });
      const user = firebaseUserToUser(cred.user);
      user.name = trimName;
      return { success: true, user };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code || '';
      return { success: false, error: getFriendlyError(code) };
    }
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const trimEmail = email.trim().toLowerCase();
      if (!trimEmail) return { success: false, error: 'Please enter your email' };
      if (!password) return { success: false, error: 'Please enter your password' };

      const cred = await signInWithEmailAndPassword(auth, trimEmail, password);
      return { success: true, user: firebaseUserToUser(cred.user) };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code || '';
      return { success: false, error: getFriendlyError(code) };
    }
  },

  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: firebaseUserToUser(result.user) };
    } catch (e: unknown) {
      const code = (e as { code?: string }).code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Sign-in cancelled. Please try again.' };
      }
      return { success: false, error: getFriendlyError(code) };
    }
  },

  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? firebaseUserToUser(fbUser) : null);
    });
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async updateName(newName: string): Promise<boolean> {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName.trim() });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  getSettings(): AppSettings {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return { notifications: true, darkMode: true, language: 'English', hapticFeedback: true, autoSave: true, compactMode: false };
  },

  saveSettings(settings: AppSettings): void {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
  },

  getStats(): { totalGenerations: number; toolsUsed: number; savedResults: number } {
    try {
      const s = localStorage.getItem(STATS_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return { totalGenerations: 0, toolsUsed: 6, savedResults: 0 };
  },

  incrementGeneration(): void {
    try {
      const stats = this.getStats();
      stats.totalGenerations += 1;
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  },
};
