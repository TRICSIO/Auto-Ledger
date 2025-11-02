
'use client';

import AppIcon from './app-icon';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 animate-fade-in">
      <div className="w-48 h-48">
        <AppIcon />
      </div>
      <h1 className="text-4xl font-bold font-headline mt-4">Momentum</h1>
    </div>
  );
}
