'use client';

import * as React from 'react';
import { countries, type Country } from '@/lib/countries';
import { useToast } from '@/hooks/use-toast';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XOF' | 'CAD' | 'AUD' | 'INR' | 'MXN' | 'BRL' | 'CHF' | 'SEK' | 'NOK' | 'DKK' | 'CNY' | 'KRW' | 'SGD' | 'ZAR' | 'NGN' | 'NZD';
export type UnitSystem = 'imperial' | 'metric';
export type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
  country: string;
  setCountry: (countryCode: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  // Default values
  const [country, setCountryState] = React.useState<string>('US');
  const [currency, setCurrencyState] = React.useState<Currency>('USD');
  const [unitSystem, setUnitSystemState] = React.useState<UnitSystem>('imperial');
  const [theme, setThemeState] = React.useState<Theme>('system');
  const [fontSize, setFontSizeState] = React.useState<number>(16);
  const [highContrast, setHighContrastState] = React.useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabledState] = React.useState<boolean>(true);


  React.useEffect(() => {
    // This effect runs once on mount to initialize settings from localStorage
    const storedCountry = localStorage.getItem('app-country');
    if (storedCountry) {
        const foundCountry = countries.find(c => c.code === storedCountry);
        if (foundCountry) {
            setCountryState(foundCountry.code);
            setCurrencyState(foundCountry.currency);
            setUnitSystemState(foundCountry.unitSystem);
        }
    } else {
        // Autodetect based on browser language if no country is set
        const lang = navigator.language.split('-')[1];
        if (lang) {
            const foundCountry = countries.find(c => c.code === lang);
            if (foundCountry) {
                setCountryState(foundCountry.code);
                setCurrencyState(foundCountry.currency);
                setUnitSystemState(foundCountry.unitSystem);
            }
        }
    }

    const storedCurrency = localStorage.getItem('app-currency') as Currency | null;
    if (storedCurrency) setCurrencyState(storedCurrency);

    const storedUnitSystem = localStorage.getItem('app-unit-system') as UnitSystem | null;
    if (storedUnitSystem) setUnitSystemState(storedUnitSystem);

    const storedTheme = (localStorage.getItem('app-theme') as Theme) || 'system';
    setThemeState(storedTheme);
    
    const storedFontSize = localStorage.getItem('app-font-size');
    if (storedFontSize) setFontSizeState(parseInt(storedFontSize, 10));
    
    const storedHighContrast = localStorage.getItem('app-high-contrast') === 'true';
    setHighContrastState(storedHighContrast);

    const storedNotifications = localStorage.getItem('notificationsEnabled');
    setNotificationsEnabledState(storedNotifications !== 'false');

  }, []);

  // --- Update Functions ---
  const setCountry = (countryCode: string) => {
    const foundCountry = countries.find(c => c.code === countryCode);
    if (foundCountry) {
      setCountryState(foundCountry.code);
      localStorage.setItem('app-country', foundCountry.code);
      
      setCurrency(foundCountry.currency);
      
      if (unitSystem !== foundCountry.unitSystem) {
        setUnitSystem(foundCountry.unitSystem);
      }
    }
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('app-currency', newCurrency);
  };

  const setUnitSystem = (newUnitSystem: UnitSystem) => {
    setUnitSystemState(newUnitSystem);
    localStorage.setItem('app-unit-system', newUnitSystem);
    toast({
        title: "Units Updated",
        description: `Measurement system set to ${newUnitSystem}. Page will reload.`,
    });
    setTimeout(() => window.location.reload(), 1000);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };
  
  const setFontSize = (newSize: number) => {
    setFontSizeState(newSize);
    localStorage.setItem('app-font-size', String(newSize));
  };
  
  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('app-high-contrast', String(enabled));
    toast({
        title: "Appearance Updated",
        description: `High Contrast mode has been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('notificationsEnabled', String(enabled));
    toast({
        title: "Notifications Updated",
        description: `Maintenance alerts have been ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  // --- Effects to apply settings to the DOM ---

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    if (highContrast) {
        root.classList.add('high-contrast');
    }
  }, [theme, highContrast]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--font-size-base', `${fontSize}px`);
  }, [fontSize]);

  const value = {
    country, setCountry,
    currency, setCurrency,
    unitSystem, setUnitSystem,
    theme, setTheme,
    fontSize, setFontSize,
    highContrast, setHighContrast,
    notificationsEnabled, setNotificationsEnabled,
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

    