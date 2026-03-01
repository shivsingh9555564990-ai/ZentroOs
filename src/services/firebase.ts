import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCx6KhmyOpbm_u1RlRy_PHYGGcIqJUOFUw",
  authDomain: "zentroos.firebaseapp.com",
  projectId: "zentroos",
  storageBucket: "zentroos.firebasestorage.app",
  messagingSenderId: "43867414038",
  appId: "1:43867414038:web:53633bc90fd8d9971d5f37",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider };
export default app;
