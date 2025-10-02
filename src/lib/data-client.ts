
'use client';
import type { Vehicle, MaintenanceTask, Expense, FuelLog, VehicleDocument } from './types';

// This is a placeholder for client-side data fetching.
// In a real app with a backend, this would make API calls.
// Since we use an in-memory "database", we will re-implement the server functions
// to show how this would work in a client context for the notifications.

let vehicles: Vehicle[] = [];
let maintenanceTasks: MaintenanceTask[] = [];
let expenses: Expense[] = [];
let fuelLogs: FuelLog[] = [];
let documents: VehicleDocument[] = [];


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

export async function getExpenses(): Promise<Expense[]> {
    try {
        const res = await fetch('/api/data?entity=expenses');
        if (!res.ok) return [];
        const data = await res.json();
        expenses = data;
        return expenses;
    } catch (e) {
        return [];
    }
}

export async function getFuelLogs(): Promise<FuelLog[]> {
    try {
        const res = await fetch('/api/data?entity=fuelLogs');
        if (!res.ok) return [];
        const data = await res.json();
        fuelLogs = data;
        return fuelLogs;
    } catch (e) {
        return [];
    }
}

export async function getDocuments(): Promise<VehicleDocument[]> {
    try {
        const res = await fetch('/api/data?entity=documents');
        if (!res.ok) return [];
        const data = await res.json();
        documents = data;
        return documents;
    } catch (e) {
        return [];
    }
}

