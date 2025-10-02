
'use server';

import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';
import { revalidatePath } from 'next/cache';

// This is a mock database. In a real application, you would use a database like Firestore or Prisma.
let vehicles: Vehicle[] = [];
let expenses: Expense[] = [];
let maintenanceTasks: MaintenanceTask[] = [];
let fuelLogs: FuelLog[] = [];
let documents: VehicleDocument[] = [];


// --- Data Access Functions ---

export async function getVehicles() {
  return vehicles;
}

export async function getVehicleById(id: string) {
  return vehicles.find(v => v.id === id);
}

export async function getExpenses() {
    return expenses;
}

export async function getExpensesByVehicleId(vehicleId: string) {
    return expenses.filter(e => e.vehicleId === vehicleId);
}

export async function getMaintenanceTasks() {
    return maintenanceTasks;
}

export async function getMaintenanceTasksByVehicleId(vehicleId: string) {
    return maintenanceTasks.filter(m => m.vehicleId === vehicleId);
}

export async function getFuelLogs() {
    return fuelLogs;
}

export async function getFuelLogsByVehicleId(vehicleId: string) {
    return fuelLogs.filter(f => f.vehicleId === vehicleId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getDocuments() {
    return documents;
}

export async function getDocumentsByVehicleId(vehicleId: string) {
    return documents.filter(d => d.vehicleId === vehicleId);
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
  vehicles.push(newVehicle);
  revalidatePath('/dashboard');
  revalidatePath('/vehicles');
  return newVehicle;
}

export async function updateVehicleImage(vehicleId: string, imageUrl: string) {
    const vehicle = await getVehicleById(vehicleId);
    if (vehicle) {
        vehicle.imageUrl = imageUrl;
        revalidatePath(`/vehicles/${vehicleId}`);
        return { success: true };
    }
    return { success: false, message: 'Vehicle not found' };
}

export async function deleteVehicle(vehicleId: string) {
  const initialLength = vehicles.length;
  vehicles = vehicles.filter(v => v.id !== vehicleId);
  expenses = expenses.filter(e => e.vehicleId !== vehicleId);
  maintenanceTasks = maintenanceTasks.filter(m => m.vehicleId !== vehicleId);
  fuelLogs = fuelLogs.filter(f => f.vehicleId !== vehicleId);
  documents = documents.filter(d => d.vehicleId !== vehicleId);
  
  if (vehicles.length < initialLength) {
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
    expenses.push(newExpense);
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
    maintenanceTasks.push(newMaintenance);
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
    fuelLogs.push(newFuelLog);
    revalidatePath(`/vehicles/${fuelLogData.vehicleId}`);
    return newFuelLog;
}

export async function addDocument(docData: Omit<VehicleDocument, 'id'>) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const newDocument: VehicleDocument = {
        ...docData,
        id: newId,
    };
    documents.push(newDocument);
    revalidatePath(`/vehicles/${docData.vehicleId}`);
    return newDocument;
}

export async function deleteDocument(docId: string) {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
        documents = documents.filter(d => d.id !== docId);
        revalidatePath(`/vehicles/${doc.vehicleId}`);
        return { success: true };
    }
    return { success: false, message: 'Document not found' };
}


// Function to restore all data for backup/restore feature
export async function setAllData(data: { vehicles: Vehicle[], expenses: Expense[], maintenanceTasks: MaintenanceTask[], fuelLogs?: FuelLog[], documents?: VehicleDocument[] }) {
    vehicles = data.vehicles || [];
    expenses = data.expenses || [];
    maintenanceTasks = data.maintenanceTasks || [];
    fuelLogs = data.fuelLogs || [];
    documents = data.documents || [];
    revalidatePath('/');
    revalidatePath('/vehicles');
    revalidatePath('/expenses');
    revalidatePath('/logs');
}
