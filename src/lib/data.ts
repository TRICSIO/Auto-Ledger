
'use server';

import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

type AppData = {
    vehicles: Vehicle[];
    expenses: Expense[];
    maintenanceTasks: MaintenanceTask[];
    fuelLogs: FuelLog[];
    documents: VehicleDocument[];
};

let data: AppData = {
    vehicles: [],
    expenses: [],
    maintenanceTasks: [],
    fuelLogs: [],
    documents: [],
};

// --- Persistence Functions ---

function loadDataFromFile() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const jsonString = fs.readFileSync(dataFilePath, 'utf-8');
            data = JSON.parse(jsonString);
        }
    } catch (error) {
        console.error("Error loading data from file:", error);
        // Initialize with empty data if file is corrupt or unreadable
        data = { vehicles: [], expenses: [], maintenanceTasks: [], fuelLogs: [], documents: [] };
    }
}

async function saveDataToFile() {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(dataFilePath, jsonString, 'utf-8');
    } catch (error) {
        console.error("Error saving data to file:", error);
    }
}

// Load data on server start
loadDataFromFile();


// --- Data Access Functions ---

export async function getVehicles() {
  return data.vehicles;
}

export async function getVehicleById(id: string) {
  return data.vehicles.find(v => v.id === id);
}

export async function getExpenses() {
    return data.expenses;
}

export async function getExpensesByVehicleId(vehicleId: string) {
    return data.expenses.filter(e => e.vehicleId === vehicleId);
}

export async function getMaintenanceTasks() {
    return data.maintenanceTasks;
}

export async function getMaintenanceTasksByVehicleId(vehicleId: string) {
    return data.maintenanceTasks.filter(m => m.vehicleId === vehicleId);
}

export async function getFuelLogs() {
    return data.fuelLogs;
}

export async function getFuelLogsByVehicleId(vehicleId: string) {
    return data.fuelLogs.filter(f => f.vehicleId === vehicleId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getDocuments() {
    return data.documents;
}

export async function getDocumentsByVehicleId(vehicleId: string) {
    return data.documents.filter(d => d.vehicleId === vehicleId);
}


// --- Data Mutation Functions ---

export async function addVehicle(vehicleData: Omit<Vehicle, 'id' | 'lastRecallCheck'>) {
  const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: newId,
    vin: vehicleData.vin || '',
    licensePlate: vehicleData.licensePlate || '',
    trim: vehicleData.trim || '',
    imageUrl: `https://logo.clearbit.com/${vehicleData.make.toLowerCase()}.com`,
    lastRecallCheck: 'Initial check pending.',
  };
  data.vehicles.push(newVehicle);
  await saveDataToFile();
  revalidatePath('/dashboard');
  revalidatePath('/vehicles');
  return newVehicle;
}

export async function updateVehicleImage(vehicleId: string, imageUrl: string) {
    const vehicle = await getVehicleById(vehicleId);
    if (vehicle) {
        vehicle.imageUrl = imageUrl;
        await saveDataToFile();
        revalidatePath(`/vehicles/${vehicleId}`);
        return { success: true };
    }
    return { success: false, message: 'Vehicle not found' };
}

export async function deleteVehicle(vehicleId: string) {
  const initialLength = data.vehicles.length;
  data.vehicles = data.vehicles.filter(v => v.id !== vehicleId);
  data.expenses = data.expenses.filter(e => e.vehicleId !== vehicleId);
  data.maintenanceTasks = data.maintenanceTasks.filter(m => m.vehicleId !== vehicleId);
  data.fuelLogs = data.fuelLogs.filter(f => f.vehicleId !== vehicleId);
  data.documents = data.documents.filter(d => d.vehicleId !== vehicleId);
  
  if (data.vehicles.length < initialLength) {
    await saveDataToFile();
    revalidatePath('/dashboard');
    revalidatePath('/vehicles');
    revalidatePath(`/vehicles/${vehicleId}`);
    return { success: true };
  }
  return { success: false, message: 'Vehicle not found.'};
}

export async function addExpense(expenseData: Omit<Expense, 'id'>) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newExpense: Expense = {
        ...expenseData,
        id: newId,
    };
    data.expenses.push(newExpense);
    await saveDataToFile();
    revalidatePath(`/vehicles/${expenseData.vehicleId}`);
    revalidatePath('/expenses');
    return newExpense;
}

export async function addMaintenance(maintenanceData: Omit<MaintenanceTask, 'id'>) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newMaintenance: MaintenanceTask = {
        ...maintenanceData,
        id: newId,
    };
    data.maintenanceTasks.push(newMaintenance);
    await saveDataToFile();
    revalidatePath(`/vehicles/${maintenanceData.vehicleId}`);
    revalidatePath('/logs');
    return newMaintenance;
}

export async function addFuelLog(fuelLogData: Omit<FuelLog, 'id'>) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newFuelLog: FuelLog = {
        ...fuelLogData,
        id: newId,
    };
    data.fuelLogs.push(newFuelLog);
    await saveDataToFile();
    revalidatePath(`/vehicles/${fuelLogData.vehicleId}`);
    return newFuelLog;
}

export async function addDocument(docData: Omit<VehicleDocument, 'id'>) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newDocument: VehicleDocument = {
        ...docData,
        id: newId,
    };
    data.documents.push(newDocument);
    await saveDataToFile();
    revalidatePath(`/vehicles/${docData.vehicleId}`);
    return newDocument;
}

export async function deleteDocument(docId: string) {
    const doc = data.documents.find(d => d.id === docId);
    if (doc) {
        data.documents = data.documents.filter(d => d.id !== docId);
        await saveDataToFile();
        revalidatePath(`/vehicles/${doc.vehicleId}`);
        return { success: true };
    }
    return { success: false, message: 'Document not found' };
}


// Function to restore all data for backup/restore feature
export async function setAllData(restoredData: AppData) {
    data.vehicles = restoredData.vehicles || [];
    data.expenses = restoredData.expenses || [];
    data.maintenanceTasks = restoredData.maintenanceTasks || [];
    data.fuelLogs = restoredData.fuelLogs || [];
    data.documents = restoredData.documents || [];
    await saveDataToFile();
    revalidatePath('/');
    revalidatePath('/vehicles');
    revalidatePath('/expenses');
    revalidatePath('/logs');
}
