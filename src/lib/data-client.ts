
'use client';
import type { Vehicle, MaintenanceTask } from './types';

// This is a placeholder for client-side data fetching.
// In a real app with a backend, this would make API calls.
// Since we use an in-memory "database", we will re-implement the server functions
// to show how this would work in a client context for the notifications.

let vehicles: Vehicle[] = [];
let maintenanceTasks: MaintenanceTask[] = [];


export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch('/api/data?entity=vehicles');
    if (!res.ok) return [];
    const data = await res.json();
    vehicles = data;
    return vehicles;
  } catch (e) {
    return [];
  }
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  try {
    const res = await fetch('/api/data?entity=maintenanceTasks');
    if (!res.ok) return [];
    const data = await res.json();
    maintenanceTasks = data;
    return maintenanceTasks;
  } catch (e) {
    return [];
  }
}
