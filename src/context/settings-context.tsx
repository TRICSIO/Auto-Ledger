'use client';

import * as React from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

interface SettingsContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<Currency>('USD');

  React.useEffect(() => {
    const storedCurrency = localStorage.getItem('app-currency') as Currency | null;
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('app-currency', newCurrency);
  };

  const value = {
    currency,
    setCurrency,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
