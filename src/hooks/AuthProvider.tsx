import { useEffect, useState, useRef } from 'react';
import { User, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { AuthContext } from './AuthContext';
import { useCircuitStore } from '../store';

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
          setUser(user);
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
        useCircuitStore.getState().showToast(errMsg, 'error');
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
      console.error("Error during Google sign-in:", error);
      let errMsg = error instanceof Error ? error.message : String(error);
      if (errMsg.includes('auth/unauthorized-domain')) {
        errMsg = "Domain not authorized. Add this app's URL to Authorized Domains in Firebase Console.";
      } else if (errMsg.includes('auth/popup-closed-by-user')) {
        return; 
      } else if (errMsg.includes('auth/popup-blocked')) {
        errMsg = "Your browser blocked the sign-in popup. Please allow popups for this site and try again.";
      }
      useCircuitStore.getState().showToast(errMsg, 'error');
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
