'use client';

import { useSettings } from '@/context/settings-context';

export function useCurrency() {
  const { currency } = useSettings();

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return '';
    }

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return { formatCurrency, currency };
}
