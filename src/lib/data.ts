
'use client';

// This file is the single source of truth for all data operations.
// It uses localStorage to persist data on the client side.

import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';
import { initialData } from './initial-data';

// --- Helper Functions ---

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  // Guard against server-side execution
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    // If parsing fails, fall back to the default value
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a storage event to notify other open tabs/windows of the change.
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

// Call initialization logic once when this module is first loaded.
initializeData();


// --- Data Access Functions ---

export function getVehicles(): Vehicle[] {
  return getLocalStorageItem('vehicles', []);
}

export function getVehicleById(id: string): Vehicle | null {
  return getVehicles().find(v => v.id === id) || null;
}

export function getExpenses(): Expense[] {
  return getLocalStorageItem('expenses', []);
}

export function getExpensesByVehicleId(vehicleId: string): Expense[] {
    return getExpenses().filter(e => e.vehicleId === vehicleId);
}

export function getMaintenanceTasks(): MaintenanceTask[] {
    return getLocalStorageItem('maintenanceTasks', []);
}

export function getMaintenanceTasksByVehicleId(vehicleId: string): MaintenanceTask[] {
    return getMaintenanceTasks().filter(t => t.vehicleId === vehicleId);
}

export function getFuelLogs(): FuelLog[] {
    return getLocalStorageItem('fuelLogs', []);
}

export function getFuelLogsByVehicleId(vehicleId: string): FuelLog[] {
    return getFuelLogs().filter(l => l.vehicleId === vehicleId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDocuments(): VehicleDocument[] {
    return getLocalStorageItem('documents', []);
}

export function getDocumentsByVehicleId(vehicleId: string): VehicleDocument[] {
    return getDocuments().filter(d => d.vehicleId === vehicleId);
}


// --- Data Mutation Functions ---

export function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'userId' | 'lastRecallCheck'>): Vehicle {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = {
    id: crypto.randomUUID(),
    userId: 'local-user', // Hardcoded for local-first app
    ...vehicleData,
    vin: vehicleData.vin || '',
    licensePlate: vehicleData.licensePlate || '',
    trim: vehicleData.trim || '',
    imageUrl: vehicleData.imageUrl || `https://logo.clearbit.com/${vehicleData.make.toLowerCase()}.com`,
    lastRecallCheck: 'Initial check pending.',
  };
  setLocalStorageItem('vehicles', [...vehicles, newVehicle]);
  return newVehicle;
}

export function updateVehicle(vehicleId: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'userId'>>): Vehicle {
    const vehicles = getVehicles();
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
        throw new Error("Vehicle not found");
    }
    const updatedVehicle = { ...vehicles[vehicleIndex], ...vehicleData };
    vehicles[vehicleIndex] = updatedVehicle;
    setLocalStorageItem('vehicles', vehicles);
    return updatedVehicle;
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
    // This is a cascading delete. Removing a vehicle also removes all associated data.
    setLocalStorageItem('vehicles', getVehicles().filter(v => v.id !== vehicleId));
    setLocalStorageItem('expenses', getExpenses().filter(e => e.vehicleId !== vehicleId));
    setLocalStorageItem('maintenanceTasks', getMaintenanceTasks().filter(t => t.vehicleId !== vehicleId));
    setLocalStorageItem('fuelLogs', getFuelLogs().filter(l => l.vehicleId !== vehicleId));
    setLocalStorageItem('documents', getDocuments().filter(d => d.vehicleId !== vehicleId));
    return { success: true };
}

export function addExpense(expenseData: Omit<Expense, 'id' | 'userId'>): Expense {
  const newExpense: Expense = {
    id: crypto.randomUUID(),
    userId: 'local-user',
    ...expenseData,
  };
  setLocalStorageItem('expenses', [...getExpenses(), newExpense]);
  return newExpense;
}

export function updateExpense(expenseId: string, expenseData: Partial<Omit<Expense, 'id' | 'userId'>>): Expense {
    const expenses = getExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) {
        throw new Error("Expense not found");
    }
    const updatedExpense = { ...expenses[expenseIndex], ...expenseData };
    expenses[expenseIndex] = updatedExpense;
    setLocalStorageItem('expenses', expenses);
    return updatedExpense;
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
    const newTask: MaintenanceTask = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...maintenanceData,
    };
    setLocalStorageItem('maintenanceTasks', [...getMaintenanceTasks(), newTask]);
    return newTask;
}

export function updateMaintenanceTask(taskId: string, taskData: Partial<Omit<MaintenanceTask, 'id'|'userId'>> & { date?: string, totalCost?: number }) {
    const tasks = getMaintenanceTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        throw new Error("Task not found");
    }

    const { date, totalCost, ...restTaskData } = taskData;
    const updatedTask = { ...tasks[taskIndex], ...restTaskData };
    tasks[taskIndex] = updatedTask;

    // Handle associated expense
    const expenses = getExpenses();
    if (updatedTask.expenseId) {
        const expenseIndex = expenses.findIndex(e => e.id === updatedTask.expenseId);
        if (expenseIndex > -1) {
            // Expense exists, update it if needed
            if (date) expenses[expenseIndex].date = date;
            if (totalCost !== undefined) expenses[expenseIndex].amount = totalCost;
            expenses[expenseIndex].description = updatedTask.task;
        }
    } else if (totalCost && totalCost > 0 && date) {
        // No expense existed, but now one should be created
        const newExpense = addExpense({
            vehicleId: updatedTask.vehicleId,
            date: date,
            amount: totalCost,
            description: updatedTask.task,
            category: 'Maintenance'
        });
        updatedTask.expenseId = newExpense.id;
    }
    
    setLocalStorageItem('maintenanceTasks', tasks);
    setLocalStorageItem('expenses', expenses);

    return { success: true, task: updatedTask };
}


export function deleteMaintenanceTask(taskId: string): { success: boolean, vehicleId?: string, expenseId?: string } {
    const tasks = getMaintenanceTasks();
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return { success: false };
    
    setLocalStorageItem('maintenanceTasks', tasks.filter(t => t.id !== taskId));

    // If there's an associated expense, delete it too
    if (taskToDelete.expenseId) {
       deleteExpense(taskToDelete.expenseId);
    }
    
    return { success: true, vehicleId: taskToDelete.vehicleId, expenseId: taskToDelete.expenseId };
}


export function addFuelLog(fuelLogData: Omit<FuelLog, 'id' | 'userId'>): FuelLog {
    const newLog: FuelLog = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...fuelLogData,
    };
    setLocalStorageItem('fuelLogs', [...getFuelLogs(), newLog]);
    return newLog;
}

export function updateFuelLog(logId: string, logData: Partial<Omit<FuelLog, 'id'|'userId'>>) {
    const logs = getFuelLogs();
    const logIndex = logs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
        throw new Error("Fuel log not found");
    }

    const updatedLog = { ...logs[logIndex], ...logData };
    logs[logIndex] = updatedLog;

    // Also update the associated expense entry
    const expenses = getExpenses();
    if (updatedLog.expenseId) {
        const expenseIndex = expenses.findIndex(e => e.id === updatedLog.expenseId);
        if (expenseIndex > -1) {
            expenses[expenseIndex].date = updatedLog.date;
            expenses[expenseIndex].amount = updatedLog.totalCost;
            expenses[expenseIndex].description = `Fuel Fill-up (${updatedLog.gallons.toFixed(2)} gal)`;
        }
    }
    
    setLocalStorageItem('fuelLogs', logs);
    setLocalStorageItem('expenses', expenses);

    return { success: true, log: updatedLog };
}


export function deleteFuelLog(fuelLogId: string): { success: boolean, vehicleId?: string, expenseId?: string } {
    const logs = getFuelLogs();
    const logToDelete = logs.find(l => l.id === fuelLogId);
    if (!logToDelete) return { success: false };
    
    setLocalStorageItem('fuelLogs', logs.filter(l => l.id !== fuelLogId));

    // Also delete the associated expense entry
    if (logToDelete.expenseId) {
        deleteExpense(logToDelete.expenseId);
    }

    return { success: true, vehicleId: logToDelete.vehicleId, expenseId: logToDelete.expenseId };
}

export function addDocument(docData: Omit<VehicleDocument, 'id' | 'userId'>): VehicleDocument {
    const newDoc: VehicleDocument = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        ...docData
    };
    setLocalStorageItem('documents', [...getDocuments(), newDoc]);
    return newDoc;
}

export function deleteDocument(docId: string): { success: boolean } {
    setLocalStorageItem('documents', getDocuments().filter(d => d.id !== docId));
    return { success: true };
}

// Function to completely overwrite all data, used for backup/restore.
export function setAllData(data: { vehicles: Vehicle[], expenses: Expense[], maintenanceTasks: MaintenanceTask[], fuelLogs: FuelLog[], documents: VehicleDocument[] }) {
    setLocalStorageItem('vehicles', data.vehicles || []);
    setLocalStorageItem('expenses', data.expenses || []);
    setLocalStorageItem('maintenanceTasks', data.maintenanceTasks || []);
    setLocalStorageItem('fuelLogs', data.fuelLogs || []);
    setLocalStorageItem('documents', data.documents || []);
}
