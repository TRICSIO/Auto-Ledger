'use client';

import { useSettings } from '@/context/settings-context';
import type { Currency } from '@/context/settings-context';

// Approximate exchange rates relative to USD for demonstration purposes.
// In a real application, these would be fetched from a live API.
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157,
  XOF: 605,
};

const LITERS_TO_GALLONS = 0.264172;

export function useCurrency() {
  const { currency, unitSystem } = useSettings();

  const convertCurrency = (value: number, from: Currency = 'USD', to: Currency = currency) => {
    const rateFrom = exchangeRates[from] || 1;
    const rateTo = exchangeRates[to] || 1;
    // Convert value to USD first, then to the target currency
    const valueInUsd = value / rateFrom;
    return valueInUsd * rateTo;
  }

  const formatCurrency = (value: number | undefined | null, baseCurrency: Currency = 'USD') => {
    if (value === undefined || value === null) {
      return '';
    }
    
    // If we're displaying price per volume, we need to adjust the value
    // if the unit system is metric, since the base value is always per gallon.
    let displayValue = value;
    if (unitSystem === 'metric' && baseCurrency === 'USD') {
      // The `value` is price per gallon, convert it to price per liter.
      displayValue = value * LITERS_TO_GALLONS;
    }
    
    const convertedValue = convertCurrency(displayValue, baseCurrency, currency);

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedValue);
  };

  return { formatCurrency, currency, convertCurrency };
}
