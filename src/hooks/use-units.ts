'use client';

import { useSettings } from '@/context/settings-context';

const MILES_TO_KM = 1.60934;
const GALLONS_TO_LITERS = 3.78541;

export function useUnits() {
  const { unitSystem } = useSettings();

  const formatDistance = (miles: number | undefined | null) => {
    if (miles === undefined || miles === null) {
      return '';
    }
    if (unitSystem === 'metric') {
      const km = miles * MILES_TO_KM;
      return `${Math.round(km).toLocaleString()} km`;
    }
    return `${Math.round(miles).toLocaleString()} mi`;
  };

  const formatVolume = (gallons: number | undefined | null) => {
     if (gallons === undefined || gallons === null) {
      return '';
    }
    if (unitSystem === 'metric') {
        const liters = gallons * GALLONS_TO_LITERS;
        return `${liters.toFixed(2)} L`;
    }
    return `${gallons.toFixed(2)} gal`;
  }
  
  const getDistanceLabel = (short = false) => {
    if (unitSystem === 'metric') {
        return short ? 'km' : 'Kilometers';
    }
    return short ? 'mi' : 'Miles';
  }

  const getVolumeLabel = (short = false) => {
      if (unitSystem === 'metric') {
          return short ? 'L' : 'Liters';
      }
      return short ? 'gal' : 'Gallons';
  }
  
  const convertToMiles = (distance: number) => {
    if (unitSystem === 'metric') {
      return distance / MILES_TO_KM;
    }
    return distance;
  };

  return {
    unitSystem,
    formatDistance,
    formatVolume,
    getDistanceLabel,
    getVolumeLabel,
    convertToMiles
  };
}
