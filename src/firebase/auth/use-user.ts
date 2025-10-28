// src/firebase/auth/use-user.ts
'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useFirebaseApp } from '../provider';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseApp = useFirebaseApp();

  useEffect(() => {
    if (firebaseApp) {
      const auth = getAuth(firebaseApp);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [firebaseApp]);

  return { user, loading };
}
