import type { Vehicle, Expense, MaintenanceTask } from './types';

// Function to generate a more unique ID
export const generateNewId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export let vehicles: Vehicle[] = [];

export let expenses: Expense[] = [];

export let maintenanceTasks: MaintenanceTask[] = [];

// Function to delete a vehicle and its associated data
export function deleteVehicle(vehicleId: string) {
  vehicles = vehicles.filter(v => v.id !== vehicleId);
  expenses = expenses.filter(e => e.vehicleId !== vehicleId);
  maintenanceTasks = maintenanceTasks.filter(m => m.vehicleId !== vehicleId);
}
