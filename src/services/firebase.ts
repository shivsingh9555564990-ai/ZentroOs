import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCx6KhmyOpbm_u1RlRy_PHYGGcIqJUOFUw",
  authDomain: "zentroos.firebaseapp.com",
  projectId: "zentroos",
  storageBucket: "zentroos.firebasestorage.app",
  messagingSenderId: "43867414038",
  appId: "1:43867414038:web:53633bc90fd8d9971d5f37",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let initError: string | null = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  initError = e instanceof Error ? e.message : 'Firebase init failed';
  console.error('Firebase init error:', e);
}

export { auth, googleProvider, initError };
export default app;
