'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './splash-screen';

const publicPaths = ['/login', '/signup'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      const isPublic = publicPaths.includes(pathname);
      if (!user && !isPublic) {
        router.replace('/login');
      } else if (user && isPublic) {
        router.replace('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || (!user && !publicPaths.includes(pathname))) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
