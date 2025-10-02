

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
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

export type ExpenseCategory = 'Fuel' | 'Maintenance' | 'Repair' | 'Insurance' | 'Registration' | 'Other';

export const expenseCategories: ExpenseCategory[] = ['Fuel', 'Maintenance', 'Repair', 'Insurance', 'Registration', 'Other'];

export type Expense = {
  id: string;
  vehicleId: string;
  date: string; // ISO string
  amount: number;
  description: string;
  category: ExpenseCategory;
};

export type MaintenanceTaskType = 'Oil Change' | 'Tire Rotation' | 'Air Filter Replacement' | 'Brake Inspection' | 'Battery Check';

export type MaintenanceTask = {
  id: string;
  vehicleId: string;
  task: string; // Allow for custom AI-suggested tasks
  lastPerformedMileage: number;
  intervalMileage: number;
};

export type FuelLog = {
  id: string;
  vehicleId: string;
  date: string; // ISO string
  odometer: number;
  gallons: number;
  totalCost: number;
};

export type VehicleDocument = {
  id: string;
  vehicleId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string; // ISO string
};
