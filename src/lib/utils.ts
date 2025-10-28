import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Vehicle } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getVehicleName = (vehicle: Vehicle, short = false) => {
    if (!vehicle) return 'Unknown Vehicle';
    if (short) return vehicle.model;
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
};
