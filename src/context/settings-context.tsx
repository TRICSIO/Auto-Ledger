'use client';

import * as React from 'react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XOF';
type UnitSystem = 'imperial' | 'metric';

interface SettingsContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<Currency>('USD');
  const [unitSystem, setUnitSystemState] = React.useState<UnitSystem>('imperial');

  React.useEffect(() => {
    const storedCurrency = localStorage.getItem('app-currency') as Currency | null;
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
    const storedUnitSystem = localStorage.getItem('app-unit-system') as UnitSystem | null;
    if (storedUnitSystem) {
      setUnitSystemState(storedUnitSystem);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('app-currency', newCurrency);
  };

  const setUnitSystem = (newUnitSystem: UnitSystem) => {
    setUnitSystemState(newUnitSystem);
    localStorage.setItem('app-unit-system', newUnitSystem);
    window.location.reload(); // Force reload to update all components
  };

  const value = {
    currency,
    setCurrency,
    unitSystem,
    setUnitSystem,
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
