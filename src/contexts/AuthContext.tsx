import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { initializeDemoData } from '@/lib/demo-data';

// Use demo auth for testing
import { 
  demoAuth, 
  doc as demoDoc, 
  getDoc as demoGetDoc, 
  setDoc as demoSetDoc,
  DemoUser 
} from '@/lib/demo-auth';

interface AuthContextType {
  user: DemoUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'admin' | 'cashier' | 'partner') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
    
    const unsubscribe = demoAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await demoGetDoc(demoDoc(null, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
        setUser(user);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await demoAuth.signInWithEmailAndPassword(email, password);
  };

  const register = async (email: string, password: string, name: string, role: 'admin' | 'cashier' | 'partner') => {
    const { user } = await demoAuth.createUserWithEmailAndPassword(email, password);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      role,
      name,
      createdAt: new Date(),
    };

    await demoSetDoc(demoDoc(null, 'users', user.uid), userProfile);
  };

  const logout = async () => {
    await demoAuth.signOut();
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};