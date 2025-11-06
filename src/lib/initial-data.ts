
import type { Vehicle, Expense, MaintenanceTask, FuelLog, VehicleDocument } from './types';

export const initialData: {
    vehicles: Vehicle[],
    expenses: Expense[],
    maintenanceTasks: MaintenanceTask[],
    fuelLogs: FuelLog[],
    documents: VehicleDocument[],
} = {
    vehicles: [],
    expenses: [],
    maintenanceTasks: [],
    fuelLogs: [],
    documents: [],
}
