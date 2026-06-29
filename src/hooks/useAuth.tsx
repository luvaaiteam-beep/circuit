import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Detect if we are running in an iframe (AI Studio preview)
    const isIframe = window.self !== window.top;
    if (isIframe) {
      import('../store').then(({ useCircuitStore }) => {
        useCircuitStore.getState().showToast(
          "Google Sign-In is blocked in preview. Please click 'Open in new tab' (arrow icon top right) to sign in.", 
          'error'
        );
      });
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      let errMsg = error instanceof Error ? error.message : String(error);
      
      if (errMsg.includes('auth/unauthorized-domain')) {
        errMsg = "Domain not authorized. Please add this app's URL to Authorized Domains in Firebase Console.";
      } else if (errMsg.includes('auth/popup-closed-by-user')) {
        errMsg = "Sign-in cancelled.";
      } else if (errMsg.includes('Cross-Origin-Opener-Policy')) {
        errMsg = "Popup blocked due to cross-origin policy. Try opening the app in a new tab.";
      }
      
      import('../store').then(({ useCircuitStore }) => {
        useCircuitStore.getState().showToast(errMsg, 'error');
      });
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
