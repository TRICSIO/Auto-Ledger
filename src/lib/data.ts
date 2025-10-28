'use client';

// This file is the single source of truth for all data operations.
// It uses localStorage to persist data on the client side.

import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';
import { initialData } from './initial-data';

// --- Helper Functions ---

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  const storedValue = window.localStorage.getItem(key);
  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return defaultValue;
    }
  }
  return defaultValue;
}

function setLocalStorageItem<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
     // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event('storage'));
  }
}

// --- Initialize Data ---

function initializeData() {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('dataInitialized')) {
        setLocalStorageItem('vehicles', initialData.vehicles);
        setLocalStorageItem('expenses', initialData.expenses);
        setLocalStorageItem('maintenanceTasks', initialData.maintenanceTasks);
        setLocalStorageItem('fuelLogs', initialData.fuelLogs);
        setLocalStorageItem('documents', initialData.documents);
        window.localStorage.setItem('dataInitialized', 'true');
    }
}

// Call initialization once
initializeData();


// --- Data Access Functions ---

export function getVehicles(): Vehicle[] {
  return getLocalStorageItem('vehicles', []);
}

export function getVehicleById(id: string): Vehicle | null {
  const vehicles = getVehicles();
  return vehicles.find(v => v.id === id) || null;
}

export function getExpenses(): Expense[] {
  return getLocalStorageItem('expenses', []);
}

export function getExpensesByVehicleId(vehicleId: string): Expense[] {
    const expenses = getExpenses();
    return expenses.filter(e => e.vehicleId === vehicleId);
}

export function getMaintenanceTasks(): MaintenanceTask[] {
    return getLocalStorageItem('maintenanceTasks', []);
}

export function getMaintenanceTasksByVehicleId(vehicleId: string): MaintenanceTask[] {
    const tasks = getMaintenanceTasks();
    return tasks.filter(t => t.vehicleId === vehicleId);
}

export function getFuelLogs(): FuelLog[] {
    return getLocalStorageItem('fuelLogs', []);
}

export function getFuelLogsByVehicleId(vehicleId: string): FuelLog[] {
    const logs = getFuelLogs();
    return logs.filter(l => l.vehicleId === vehicleId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDocuments(): VehicleDocument[] {
    return getLocalStorageItem('documents', []);
}

export function getDocumentsByVehicleId(vehicleId: string): VehicleDocument[] {
    const docs = getDocuments();
    return docs.filter(d => d.vehicleId === vehicleId);
}


// --- Data Mutation Functions ---

export function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'userId' | 'lastRecallCheck'>): Vehicle {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = {
    id: crypto.randomUUID(),
    userId: 'local-user',
    ...vehicleData,
    vin: vehicleData.vin || '',
    licensePlate: vehicleData.licensePlate || '',
    trim: vehicleData.trim || '',
    imageUrl: vehicleData.imageUrl || `https://logo.clearbit.com/${vehicleData.make.toLowerCase()}.com`,
    lastRecallCheck: 'Initial check pending.',
  };
  const newVehicles = [...vehicles, newVehicle];
  setLocalStorageItem('vehicles', newVehicles);
  return newVehicle;
}

export function updateVehicleImage(vehicleId: string, imageUrl: string): { success: boolean } {
    const vehicles = getVehicles();
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex > -1) {
        vehicles[vehicleIndex].imageUrl = imageUrl;
        setLocalStorageItem('vehicles', vehicles);
        return { success: true };
    }
    return { success: false };
}


export function deleteVehicle(vehicleId: string): { success: boolean } {
    const newVehicles = getVehicles().filter(v => v.id !== vehicleId);
    setLocalStorageItem('vehicles', newVehicles);

    const newExpenses = getExpenses().filter(e => e.vehicleId !== vehicleId);
    setLocalStorageItem('expenses', newExpenses);

    const newTasks = getMaintenanceTasks().filter(t => t.vehicleId !== vehicleId);
    setLocalStorageItem('maintenanceTasks', newTasks);

    const newLogs = getFuelLogs().filter(l => l.vehicleId !== vehicleId);
    setLocalStorageItem('fuelLogs', newLogs);

    const newDocs = getDocuments().filter(d => d.vehicleId !== vehicleId);
    setLocalStorageItem('documents', newDocs);

    return { success: true };
}

export function addExpense(expenseData: Omit<Expense, 'id' | 'userId'>): Expense {
  const expenses = getExpenses();
  const newExpense: Expense = {
    id: crypto.randomUUID(),
    userId: 'local-user',
    ...expenseData,
  };
  const newExpenses = [...expenses, newExpense];
  setLocalStorageItem('expenses', newExpenses);
  return newExpense;
}

export function deleteExpense(expenseId: string): { success: boolean, vehicleId?: string } {
    const expenses = getExpenses();
    const expenseToDelete = expenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return { success: false };

    const newExpenses = expenses.filter(e => e.id !== expenseId);
    setLocalStorageItem('expenses', newExpenses);
    return { success: true, vehicleId: expenseToDelete.vehicleId };
}


export function addMaintenanceTask(maintenanceData: Omit<MaintenanceTask, 'id' | 'userId'>): MaintenanceTask {
    const tasks = getMaintenanceTasks();
    const newTask: MaintenanceTask = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...maintenanceData,
    };
    const newTasks = [...tasks, newTask];
    setLocalStorageItem('maintenanceTasks', newTasks);
    return newTask;
}

export function deleteMaintenanceTask(taskId: string): { success: boolean, vehicleId?: string, expenseId?: string } {
    const tasks = getMaintenanceTasks();
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return { success: false };
    
    const newTasks = tasks.filter(t => t.id !== taskId);
    setLocalStorageItem('maintenanceTasks', newTasks);

    // If there's an associated expense, delete it too
    if (taskToDelete.expenseId) {
       deleteExpense(taskToDelete.expenseId);
    }
    
    return { success: true, vehicleId: taskToDelete.vehicleId, expenseId: taskToDelete.expenseId };
}


export function addFuelLog(fuelLogData: Omit<FuelLog, 'id' | 'userId'>): FuelLog {
    const logs = getFuelLogs();
    const newLog: FuelLog = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...fuelLogData,
    };
    const newLogs = [...logs, newLog];
    setLocalStorageItem('fuelLogs', newLogs);
    return newLog;
}

export function deleteFuelLog(fuelLogId: string): { success: boolean, vehicleId?: string, expenseId?: string } {
    const logs = getFuelLogs();
    const logToDelete = logs.find(l => l.id === fuelLogId);
    if (!logToDelete) return { success: false };
    
    const newLogs = logs.filter(l => l.id !== fuelLogId);
    setLocalStorageItem('fuelLogs', newLogs);

    if (logToDelete.expenseId) {
        deleteExpense(logToDelete.expenseId);
    }

    return { success: true, vehicleId: logToDelete.vehicleId, expenseId: logToDelete.expenseId };
}

export function addDocument(docData: Omit<VehicleDocument, 'id' | 'userId'>): VehicleDocument {
    const docs = getDocuments();
    const newDoc: VehicleDocument = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...docData
    };
    const newDocs = [...docs, newDoc];
    setLocalStorageItem('documents', newDocs);
    return newDoc;
}

export function deleteDocument(docId: string): { success: boolean } {
    const newDocs = getDocuments().filter(d => d.id !== docId);
    setLocalStorageItem('documents', newDocs);
    return { success: true };
}

export function setAllData(data: { vehicles: Vehicle[], expenses: Expense[], maintenanceTasks: MaintenanceTask[], fuelLogs: FuelLog[], documents: VehicleDocument[] }) {
    setLocalStorageItem('vehicles', data.vehicles || []);
    setLocalStorageItem('expenses', data.expenses || []);
    setLocalStorageItem('maintenanceTasks', data.maintenanceTasks || []);
    setLocalStorageItem('fuelLogs', data.fuelLogs || []);
    setLocalStorageItem('documents', data.documents || []);
}
