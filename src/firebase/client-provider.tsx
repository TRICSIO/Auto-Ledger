// src/firebase/client-provider.tsx
'use client';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

// Initialize Firebase on the client
const { firebaseApp, auth, firestore } = initializeFirebase();

/**
 * A client-side component that initializes Firebase and provides it to the app.
 * This should be used at the root of the client-side component tree.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
