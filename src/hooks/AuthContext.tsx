import { createContext, useContext } from 'react';

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    signInWithGoogle: async () => { window.location.href = '/sim'; },
    signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);
