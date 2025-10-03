'use client';

import * as React from 'react';
import { countries, type Country } from '@/lib/countries';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XOF' | 'CAD' | 'AUD' | 'INR' | 'MXN' | 'BRL' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'CNY' | 'KRW' | 'SGD' | 'ZAR' | 'NGN' | 'NZD';
export type UnitSystem = 'imperial' | 'metric';

interface SettingsContextType {
  country: string;
  setCountry: (countryCode: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = React.useState<string>('US');
  const [currency, setCurrencyState] = React.useState<Currency>('USD');
  const [unitSystem, setUnitSystemState] = React.useState<UnitSystem>('imperial');

  React.useEffect(() => {
    const storedCountry = localStorage.getItem('app-country');
    if (storedCountry) {
        const foundCountry = countries.find(c => c.code === storedCountry);
        if (foundCountry) {
            setCountryState(foundCountry.code);
            setCurrencyState(foundCountry.currency);
            setUnitSystemState(foundCountry.unitSystem);
        }
    }

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

  const setCountry = (countryCode: string) => {
    const foundCountry = countries.find(c => c.code === countryCode);
    if (foundCountry) {
      setCountryState(foundCountry.code);
      localStorage.setItem('app-country', foundCountry.code);
      
      setCurrency(foundCountry.currency);
      
      // Only trigger a full reload if the unit system actually changes
      if (unitSystem !== foundCountry.unitSystem) {
        setUnitSystem(foundCountry.unitSystem);
      }
    }
  };

  const value = {
    country,
    setCountry,
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
