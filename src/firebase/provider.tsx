// src/firebase/provider.tsx
'use client';
import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Define the context type
interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Define the provider component
export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
firestore,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Define the hooks
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  return context.firebaseApp;
}

export function useAuth() {
  const context = useFirebase();
  return context.auth;
}

export function useFirestore() {
    const context = useFirebase();
    return context.firestore;
}
