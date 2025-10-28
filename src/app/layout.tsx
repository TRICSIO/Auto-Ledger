'use client';

import * as React from 'react';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import SplashScreen from '@/components/splash-screen';
import { SettingsProvider } from '@/context/settings-context';
import { PrivacyProvider } from '@/context/privacy-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // This timeout simulates a loading period for the splash screen
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AutoLedger</title>
        <meta name="description" content="A modern, AI-powered app to manage your vehicle's maintenance, expenses, and fuel." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-body antialiased">
        <SettingsProvider>
          <PrivacyProvider>
            {loading ? (
              <SplashScreen />
            ) : (
              <div className="flex min-h-screen w-full flex-col bg-background">
                {children}
              </div>
            )}
            <Toaster />
          </PrivacyProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
