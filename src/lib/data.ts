
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

// --- Sample Data Generation ---
function getSampleData(): AppData {
    const civicId = 'sample_civic_2023';
    const f150Id = 'sample_f150_2022';
    const scramblerId = 'sample_scrambler_2023';

    return {
        vehicles: [
            {
                id: civicId,
                make: 'Honda',
                model: 'Civic',
                year: 2023,
                vehicleType: 'Car',
                trim: 'Touring',
                engineType: 'Gasoline',
                driveType: 'FWD',
                transmission: 'Automatic',
                vin: '1HGFE2F55PA000001',
                licensePlate: 'CIVIC23',
                mileage: 15000,
                imageUrl: 'https://logo.clearbit.com/honda.com',
                lastRecallCheck: 'No new recalls found.',
            },
            {
                id: f150Id,
                make: 'Ford',
                model: 'F-150',
                year: 2022,
                vehicleType: 'Car',
                trim: 'Lariat',
                engineType: 'Gasoline',
                driveType: '4WD',
                transmission: 'Automatic',
                vin: '1FTFW1E53PKA00001',
                licensePlate: 'TRUCKIN',
                mileage: 32500,
                imageUrl: 'https://logo.clearbit.com/ford.com',
                lastRecallCheck: 'Recall found for powertrain control module.',
            },
            {
                id: scramblerId,
                make: 'Ducati',
                model: 'Scrambler',
                year: 2023,
                vehicleType: 'Motorcycle',
                trim: 'Icon',
                engineType: 'Gasoline',
                driveType: 'Chain',
                transmission: 'Manual',
                vin: 'ZDM821P17PB000001',
                licensePlate: 'RIDEON',
                mileage: 4500,
                imageUrl: 'https://logo.clearbit.com/ducati.com',
                lastRecallCheck: 'Initial check pending.',
            },
        ],
        expenses: [
            { id: 'exp1', vehicleId: civicId, date: '2024-05-15T12:00:00.000Z', amount: 45.50, description: 'Fuel Fill-up', category: 'Fuel' },
            { id: 'exp2', vehicleId: civicId, date: '2024-04-01T12:00:00.000Z', amount: 650.00, description: '6-Month Insurance Premium', category: 'Insurance' },
            { id: 'exp3', vehicleId: f150Id, date: '2024-05-10T12:00:00.000Z', amount: 88.20, description: 'Fuel Fill-up', category: 'Fuel' },
            { id: 'exp4', vehicleId: f150Id, date: '2024-03-20T12:00:00.000Z', amount: 125.00, description: 'Brake Pad Replacement', category: 'Maintenance' },
            { id: 'exp5', vehicleId: scramblerId, date: '2024-05-20T12:00:00.000Z', amount: 21.50, description: 'Fuel Fill-up', category: 'Fuel' },
        ],
        maintenanceTasks: [
            { id: 'task1', vehicleId: civicId, task: 'Oil Change', lastPerformedMileage: 9800, intervalMileage: 7500 },
            { id: 'task2', vehicleId: civicId, task: 'Tire Rotation', lastPerformedMileage: 9800, intervalMileage: 7500 },
            { id: 'task3', vehicleId: f150Id, task: 'Oil Change', lastPerformedMileage: 29500, intervalMileage: 5000 },
            { id: 'task4', vehicleId: scramblerId, task: 'Oil Change', lastPerformedMileage: 3000, intervalMileage: 3000 },
        ],
        fuelLogs: [
            { id: 'fuel1', vehicleId: civicId, date: '2024-05-01T12:00:00.000Z', odometer: 14650, gallons: 10.5, totalCost: 40.95 },
            { id: 'fuel2', vehicleId: civicId, date: '2024-05-15T12:00:00.000Z', odometer: 15000, gallons: 11.2, totalCost: 45.50 },
            { id: 'fuel3', vehicleId: f150Id, date: '2024-04-28T12:00:00.000Z', odometer: 32050, gallons: 22.5, totalCost: 81.00 },
            { id: 'fuel4', vehicleId: f150Id, date: '2024-05-10T12:00:00.000Z', odometer: 32500, gallons: 24.5, totalCost: 88.20 },
            { id: 'fuel5', vehicleId: scramblerId, date: '2024-05-20T12:00:00.000Z', odometer: 4500, gallons: 3.5, totalCost: 21.50 },

        ],
        documents: [
            { id: 'doc1', vehicleId: civicId, fileName: 'Insurance-Card-2024.pdf', fileType: 'application/pdf', uploadedAt: new Date().toISOString() },
            { id: 'doc2', vehicleId: civicId, fileName: 'Vehicle-Registration.pdf', fileType: 'application/pdf', uploadedAt: new Date().toISOString() },
        ]
    };
}


// --- Persistence Functions ---

function loadDataFromFile() {
    try {
        if (fs.existsSync(dataFilePath)) {
            const jsonString = fs.readFileSync(dataFilePath, 'utf-8');
            const fileData = JSON.parse(jsonString);
            // Check if file is empty or doesn't have vehicles
            if (fileData && fileData.vehicles && fileData.vehicles.length > 0) {
                 data = fileData;
            } else {
                console.log("Data file is empty. Initializing with sample data.");
                data = getSampleData();
                saveDataToFile();
            }
        } else {
            console.log("No data file found. Initializing with sample data.");
            data = getSampleData();
            saveDataToFile();
        }
    } catch (error) {
        console.error("Error loading data from file:", error);
        // Initialize with sample data if file is corrupt or unreadable
        data = getSampleData();
        saveDataToFile();
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
