'use client';

import { useSettings } from '@/context/settings-context';

// Approximate exchange rates relative to USD for demonstration purposes.
// In a real application, these would be fetched from a live API.
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157,
  XOF: 605,
};


export function useCurrency() {
  const { currency } = useSettings();

  const convertCurrency = (value: number) => {
    const rate = exchangeRates[currency] || 1;
    return value * rate;
  }

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return '';
    }
    
    const convertedValue = convertCurrency(value);

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedValue);
  };

  return { formatCurrency, currency, convertCurrency };
}
