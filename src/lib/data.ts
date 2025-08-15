import type { Vehicle, Expense, MaintenanceTask } from './types';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    trim: 'Touring',
    engineType: 'Gasoline',
    driveType: 'FWD',
    transmission: 'Automatic',
    vin: '1HGFE2F59NL000001',
    licensePlate: 'CIVIC22',
    mileage: 25000,
    imageUrl: 'https://logo.clearbit.com/honda.com',
    lastRecallCheck: 'No recalls found as of last check.',
  },
  {
    id: '2',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    trim: 'Lariat',
    engineType: 'Gasoline',
    driveType: '4WD',
    transmission: 'Automatic',
    vin: '1FTFW1E53KFC00002',
    licensePlate: 'TRUCK21',
    mileage: 45000,
    imageUrl: 'https://logo.clearbit.com/ford.com',
  },
];

export const expenses: Expense[] = [
  // Vehicle 1 Expenses
  { id: 'exp1', vehicleId: '1', date: '2024-07-15', amount: 45.50, description: 'Shell Gas Station', category: 'Fuel' },
  { id: 'exp2', vehicleId: '1', date: '2024-07-01', amount: 85.00, description: 'Oil Change at Jiffy Lube', category: 'Maintenance' },
  { id: 'exp3', vehicleId: '1', date: '2024-06-20', amount: 250.75, description: 'New front tires', category: 'Repair' },
  { id: 'exp4', vehicleId: '1', date: '2024-06-05', amount: 120.00, description: '6-month insurance premium', category: 'Insurance' },
  { id: 'exp9', vehicleId: '1', date: '2024-01-15', amount: 180.00, description: 'Annual Registration Fee', category: 'Registration' },


  // Vehicle 2 Expenses
  { id: 'exp5', vehicleId: '2', date: '2024-07-18', amount: 80.25, description: 'Exxon Gas Station', category: 'Fuel' },
  { id: 'exp6', vehicleId: '2', date: '2024-06-30', amount: 120.00, description: 'Brake pad replacement', category: 'Repair' },
  { id: 'exp7', vehicleId: '2', date: '2024-05-15', amount: 65.00, description: 'Fuel filter change', category: 'Maintenance' },
  { id: 'exp8', vehicleId: '2', date: '2024-07-01', amount: 150.00, description: '6-month insurance premium', category: 'Insurance' },
  { id: 'exp10', vehicleId: '2', date: '2024-03-20', amount: 220.00, description: 'Annual Registration Fee', category: 'Registration' },
];

export const maintenanceTasks: MaintenanceTask[] = [
  // Vehicle 1 Maintenance
  { id: 'maint1', vehicleId: '1', task: 'Oil Change', lastPerformedMileage: 22000, intervalMileage: 5000 },
  { id: 'maint2', vehicleId: '1', task: 'Tire Rotation', lastPerformedMileage: 20000, intervalMileage: 7500 },

  // Vehicle 2 Maintenance
  { id: 'maint3', vehicleId: '2', task: 'Oil Change', lastPerformedMileage: 43000, intervalMileage: 5000 },
  { id: 'maint4', vehicleId: '2', task: 'Brake Inspection', lastPerformedMileage: 40000, intervalMileage: 15000 },
];
