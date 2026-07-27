import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
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

  const redirectChecked = useRef(false);
  useEffect(() => {
    if (redirectChecked.current) return;
    redirectChecked.current = true;

    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp()
          }, { merge: true });
        }
      })
      .catch((error) => {
        console.error("Error completing Google sign-in:", error);
        let errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg.includes('auth/unauthorized-domain')) {
          errMsg = "Domain not authorized. Add this app's URL to Authorized Domains in Firebase Console.";
        }
        import('../store').then(({ useCircuitStore }) => {
          useCircuitStore.getState().showToast(errMsg, 'error');
        });
      });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error starting Google sign-in:", error);
      let errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('auth/unauthorized-domain')) {
        errMsg = "Domain not authorized. Add this app's URL to Authorized Domains in Firebase Console.";
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
