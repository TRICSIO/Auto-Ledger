

import { Car, Bike, DollarSign, Wrench } from "lucide-react";

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicleType: 'Car' | 'Motorcycle';
  trim: string;
  engineType: string;
  driveType: string;
  transmission: string;
  vin: string;
  licensePlate: string;
  mileage: number;
  imageUrl?: string;
  lastRecallCheck?: string;
};

export const vehicleTypes = ['Car', 'Motorcycle'];

export const vehicleIcons = {
    'Car': Car,
    'Motorcycle': Bike,
};

export type ExpenseCategory = 'Fuel' | 'Maintenance' | 'Repair' | 'Insurance' | 'Registration' | 'Other';

export const expenseCategories: ExpenseCategory[] = ['Fuel', 'Maintenance', 'Repair', 'Insurance', 'Registration', 'Other'];

export type MaintenanceTaskType = 'Oil Change' | 'Tire Rotation' | 'Air Filter Replacement' | 'Brake Inspection' | 'Battery Check';

export const maintenanceTaskTypes: MaintenanceTaskType[] = ['Oil Change', 'Tire Rotation', 'Air Filter Replacement', 'Brake Inspection', 'Battery Check'];

export type MaintenanceTask = {
  id: string;
  vehicleId: string;
  task: string; // Allow for custom AI-suggested tasks
  lastPerformedMileage: number;
  intervalMileage: number;
  expenseId?: string; // Link to an expense
};

export type Expense = {
  id: string;
  vehicleId: string;
  date: string; // ISO string
  amount: number;
  description: string;
  category: ExpenseCategory;
};


export type FuelLog = {
  id: string;
  vehicleId: string;
  date: string; // ISO string
  odometer: number;
  gallons: number;
  totalCost: number;
  expenseId?: string; // Link to an expense
};

export type VehicleDocument = {
  id: string;
  vehicleId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string; // ISO string
};


export type ActivityLog = {
    type: 'Maintenance' | 'Expense';
    date: string; // ISO string
    vehicleId: string;
    id: string;
    details: MaintenanceTask | Expense;
};

export const activityIcons = {
    'Maintenance': Wrench,
    'Expense': DollarSign,
};
