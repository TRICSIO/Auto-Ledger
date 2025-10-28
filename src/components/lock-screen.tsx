'use client';

import * as React from 'react';
import { ShieldCheck, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AppIcon from './app-icon';

interface LockScreenProps {
  onUnlock: () => void;
  onForgotPin: () => void;
  isPinSet: boolean;
}

export default function LockScreen({ onUnlock, onForgotPin, isPinSet }: LockScreenProps) {
  const [pin, setPin] = React.useState('');
  const [error, setError] = React.useState('');
  const { toast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value.replace(/[^0-9]/g, '');
    if (newPin.length <= 4) {
      setPin(newPin);
      setError('');
    }
  };

  const handleUnlockAttempt = () => {
    // In a real app, this would involve a secure check.
    // For this implementation, the check is handled by the context.
    const storedPin = localStorage.getItem('app-pin');
    if (storedPin === pin) {
      onUnlock();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  const handleBiometricUnlock = async () => {
    // This is a placeholder for biometric functionality.
    // Real implementation requires complex integration with WebAuthn API.
    toast({
      title: 'Biometric Unlock',
      description: 'Biometric authentication is not implemented in this demo, but this is where it would be triggered.',
    });
  };

  if (!isPinSet) {
    return null; // Should not be rendered if PIN is not set, but as a safeguard.
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center p-8 max-w-sm w-full">
        <div className="w-24 h-24 mb-6">
          <AppIcon />
        </div>
        <h1 className="text-2xl font-bold font-headline">Application Locked</h1>
        <p className="text-muted-foreground mt-2">
          Enter your 4-digit PIN to unlock AutoLedger.
        </p>
        <div className="flex gap-2 my-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-colors ${
                pin.length > index ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <Input
          type="password"
          maxLength={4}
          value={pin}
          onChange={handlePinChange}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlockAttempt()}
          className="w-full text-center text-2xl tracking-[1em] [caret-color:transparent]"
          autoFocus
        />
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        <Button onClick={handleUnlockAttempt} className="mt-6 w-full" disabled={pin.length !== 4}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Unlock
        </Button>
        <Button variant="ghost" onClick={handleBiometricUnlock} className="mt-4 w-full" disabled>
          <Fingerprint className="mr-2 h-4 w-4" />
          Use Biometrics (Coming Soon)
        </Button>
        <Button variant="link" size="sm" onClick={onForgotPin} className="mt-8">
          Forgot PIN?
        </Button>
      </div>
    </div>
  );
}
