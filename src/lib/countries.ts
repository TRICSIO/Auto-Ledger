
import type { Currency, UnitSystem } from '@/context/settings-context';

export interface Country {
  code: string;
  name: string;
  currency: Currency;
  unitSystem: UnitSystem;
}

export const countries: Country[] = [
  // Americas
  { code: 'US', name: 'United States', currency: 'USD', unitSystem: 'imperial' },
  { code: 'CA', name: 'Canada', currency: 'CAD', unitSystem: 'metric' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', unitSystem: 'metric' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', unitSystem: 'metric' },

  // Europe
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', unitSystem: 'imperial' },
  { code: 'DE', name: 'Germany', currency: 'EUR', unitSystem: 'metric' },
  { code: 'FR', name: 'France', currency: 'EUR', unitSystem: 'metric' },
  { code: 'IT', name: 'Italy', currency: 'EUR', unitSystem: 'metric' },
  { code: 'ES', name: 'Spain', currency: 'EUR', unitSystem: 'metric' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', unitSystem: 'metric' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', unitSystem: 'metric' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', unitSystem: 'metric' },
  { code: 'NO', name: 'Norway', currency: 'NOK', unitSystem: 'metric' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', unitSystem: 'metric' },

  // Asia
  { code: 'JP', name: 'Japan', currency: 'JPY', unitSystem: 'metric' },
  { code: 'CN', name: 'China', currency: 'CNY', unitSystem: 'metric' },
  { code: 'IN', name: 'India', currency: 'INR', unitSystem: 'metric' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', unitSystem: 'metric' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', unitSystem: 'metric' },

  // Oceania
  { code: 'AU', name: 'Australia', currency: 'AUD', unitSystem: 'metric' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', unitSystem: 'metric' },
  
  // Africa
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', unitSystem: 'metric' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', unitSystem: 'metric' },
  { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF', unitSystem: 'metric' },
  { code: 'SN', name: 'Senegal', currency: 'XOF', unitSystem: 'metric' },
];
