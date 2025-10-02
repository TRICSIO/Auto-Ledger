
'use client';
import type { Vehicle, MaintenanceTask, Expense, FuelLog, VehicleDocument } from './types';

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch('/api/data?entity=vehicles');
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('Failed to fetch vehicles client-side:', e);
    return [];
  }
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  try {
    const res = await fetch('/api/data?entity=maintenanceTasks');
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('Failed to fetch tasks client-side:', e);
    return [];
  }
}

export async function getExpenses(): Promise<Expense[]> {
    try {
        const res = await fetch('/api/data?entity=expenses');
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch expenses client-side:', e);
        return [];
    }
}

export async function getFuelLogs(): Promise<FuelLog[]> {
    try {
        const res = await fetch('/api/data?entity=fuelLogs');
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch fuel logs client-side:', e);
        return [];
    }
}

export async function getDocuments(): Promise<VehicleDocument[]> {
    try {
        const res = await fetch('/api/data?entity=documents');
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch documents client-side:', e);
        return [];
    }
}
