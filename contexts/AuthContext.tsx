// contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {doc,setDoc, getDoc} from 'firebase/firestore';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
    }); 
  }; 


  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if(!userDoc.exists()){
        const  name = user.displayName?.split(' ') || [];
        const firstName = name[0] || '';
        const lastName = name.slice(1).join(' ') || '';
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),  
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };
  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}