'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import SplashScreen from '@/components/splash-screen';
import { SettingsProvider } from '@/context/settings-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Setting loading to false immediately on component mount
    // to avoid the artificial delay.
    setLoading(false);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SettingsProvider>
            {loading ? (
            <SplashScreen />
            ) : (
            <div className="flex min-h-screen w-full flex-col">
                {children}
            </div>
            )}
            <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
