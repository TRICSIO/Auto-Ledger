
'use client';
import type { Vehicle, MaintenanceTask, Expense, FuelLog, VehicleDocument } from './types';
import { getAuth } from 'firebase/auth';

async function getHeaders() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return {
            'Authorization': `Bearer ${token}`
        };
    }
    return {};
}

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const headers = await getHeaders();
    const res = await fetch('/api/data?entity=vehicles', { headers });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('Failed to fetch vehicles client-side:', e);
    return [];
  }
}

export async function getMaintenanceTasks(): Promise<MaintenanceTask[]> {
  try {
    const headers = await getHeaders();
    const res = await fetch('/api/data?entity=maintenanceTasks', { headers });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error('Failed to fetch tasks client-side:', e);
    return [];
  }
}

export async function getExpenses(): Promise<Expense[]> {
    try {
        const headers = await getHeaders();
        const res = await fetch('/api/data?entity=expenses', { headers });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch expenses client-side:', e);
        return [];
    }
}

export async function getFuelLogs(): Promise<FuelLog[]> {
    try {
        const headers = await getHeaders();
        const res = await fetch('/api/data?entity=fuelLogs', { headers });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch fuel logs client-side:', e);
        return [];
    }
}

export async function getDocuments(): Promise<VehicleDocument[]> {
    try {
        const headers = await getHeaders();
        const res = await fetch('/api/data?entity=documents', { headers });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch documents client-side:', e);
        return [];
    }
}
