
'use client';
import type { Vehicle, MaintenanceTask, Expense, FuelLog, VehicleDocument } from './types';
import * as db from './data';

// This client-side data access layer reads directly from the functions in data.ts,
// which now use localStorage. This avoids network requests and ensures the UI
// is always in sync with the local data.

export function getVehicles(): Vehicle[] {
  return db.getVehicles();
}

export function getMaintenanceTasks(): MaintenanceTask[] {
  return db.getMaintenanceTasks();
}

export function getExpenses(): Expense[] {
  return db.getExpenses();
}

export function getFuelLogs(): FuelLog[] {
  return db.getFuelLogs();
}

export function getDocuments(): VehicleDocument[] {
    return db.getDocuments();
}

export function getVehicleById(id: string): Vehicle | null {
    return db.getVehicleById(id);
}

export function getExpensesByVehicleId(vehicleId: string): Expense[] {
    return db.getExpensesByVehicleId(vehicleId);
}

export function getMaintenanceTasksByVehicleId(vehicleId: string): MaintenanceTask[] {
    return db.getMaintenanceTasksByVehicleId(vehicleId);
}

export function getFuelLogsByVehicleId(vehicleId: string): FuelLog[] {
    return db.getFuelLogsByVehicleId(vehicleId);
}

export function getDocumentsByVehicleId(vehicleId: string): VehicleDocument[] {
    return db.getDocumentsByVehicleId(vehicleId);
}
