'use client';

import * as React from 'react';
import LockScreen from '@/components/lock-screen';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface PrivacyContextType {
  isLocked: boolean;
  isPinSet: boolean;
  isLockEnabled: boolean;
  setIsLockEnabled: (enabled: boolean) => void;
  setPin: (pin: string) => void;
  changePin: (oldPin: string, newPin: string) => boolean;
  lockApp: () => void;
}

const PrivacyContext = React.createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = React.useState(true);
  const [isPinSet, setIsPinSet] = React.useState(false);
  const [isLockEnabled, setIsLockEnabledState] = React.useState(false);
  const [showForgotPinDialog, setShowForgotPinDialog] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const pin = localStorage.getItem('app-pin');
    const lockEnabled = localStorage.getItem('app-lock-enabled') === 'true';
    setIsPinSet(!!pin);
    setIsLockEnabledState(lockEnabled);

    if (lockEnabled && !!pin) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    toast({ title: 'Application Unlocked' });
  };

  const lockApp = () => {
    if (isLockEnabled) {
      setIsLocked(true);
    }
  };

  const setIsLockEnabled = (enabled: boolean) => {
    if (enabled && !isPinSet) {
      // This case is handled in the settings page UI, but as a fallback
      toast({ variant: 'destructive', title: 'Error', description: 'Please set a PIN before enabling the lock.' });
      return;
    }
    setIsLockEnabledState(enabled);
    localStorage.setItem('app-lock-enabled', String(enabled));
    if (enabled) {
      lockApp();
    }
    toast({
      title: 'Privacy Lock Updated',
      description: `Privacy Lock has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  const setPin = (pin: string) => {
    localStorage.setItem('app-pin', pin);
    setIsPinSet(true);
    setIsLockEnabled(true); // Automatically enable lock when PIN is set
  };

  const changePin = (oldPin: string, newPin: string): boolean => {
      const storedPin = localStorage.getItem('app-pin');
      if (storedPin !== oldPin) {
          return false;
      }
      localStorage.setItem('app-pin', newPin);
      return true;
  }

  const handleForgotPin = () => {
    setShowForgotPinDialog(true);
  };
  
  const handleReset = () => {
      localStorage.clear();
      toast({ title: "Application Reset", description: "All data has been cleared. The app will now reload."});
      setTimeout(() => window.location.reload(), 1500);
  }

  const value = {
    isLocked,
    isPinSet,
    isLockEnabled,
    setIsLockEnabled,
    setPin,
    changePin,
    lockApp,
  };

  return (
    <PrivacyContext.Provider value={value}>
      {isLocked ? (
        <LockScreen onUnlock={handleUnlock} onForgotPin={handleForgotPin} isPinSet={isPinSet} />
      ) : (
        children
      )}
      <AlertDialog open={showForgotPinDialog} onOpenChange={setShowForgotPinDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forgot Your PIN?</AlertDialogTitle>
            <AlertDialogDescription>
              Because your data is stored locally on this device for privacy, there is no way to recover a forgotten PIN.
              <br/><br/>
              The only way to continue is to **reset the application**. This will delete all your vehicles, logs, and settings permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button onClick={handleReset} variant="destructive">I understand, reset my data</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  const context = React.useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
}
