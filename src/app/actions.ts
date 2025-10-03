'use server';

import { checkVehicleRecall, type CheckVehicleRecallInput, type CheckVehicleRecallOutput } from '@/ai/flows/check-vehicle-recall';
import { predictVehicleIssues, type PredictVehicleIssuesInput, type PredictVehicleIssuesOutput } from '@/ai/flows/predict-vehicle-issues';
import { addVehicle, addExpense as addExpenseToDb, addMaintenance as addMaintenanceToDb, deleteVehicle as deleteVehicleFromDb, addFuelLog as addFuelLogToDb, addDocument, deleteDocument as deleteDocumentFromDb, updateVehicleImage as updateVehicleImageInDb } from '@/lib/data';
import type { Vehicle, FuelLog, VehicleDocument, MaintenanceTask, Expense } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function checkVehicleRecallAction(input: CheckVehicleRecallInput): Promise<CheckVehicleRecallOutput> {
  try {
    const result = await checkVehicleRecall(input);
    if (result.hasNewRecall) {
      revalidatePath(`/vehicles/${input.vin}`); 
    }
    return result;
  } catch (error) {
    console.error('Error checking vehicle recall:', error);
    return {
      hasNewRecall: false,
      recallDescription: 'An error occurred while checking for recalls. Please try again later.'
    };
  }
}

export async function predictVehicleIssuesAction(input: PredictVehicleIssuesInput): Promise<PredictVehicleIssuesOutput> {
  try {
    const result = await predictVehicleIssues(input);
    return result;
  } catch (error) {
    console.error('Error predicting vehicle issues:', error);
    return {
      predictedFailures: [],
      proactiveReminders: [],
      recommendedIntervals: [],
    };
  }
}

export async function addVehicleAction(vehicleData: Omit<Vehicle, 'id' | 'lastRecallCheck'>) {
    try {
        const newVehicle = await addVehicle(vehicleData);
        revalidatePath('/vehicles');
        revalidatePath('/');
        return { success: true, vehicle: newVehicle };
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return { success: false, message: 'Failed to add vehicle.' };
    }
}

export async function updateVehicleImageAction(vehicleId: string, imageUrl: string) {
    return await updateVehicleImageInDb(vehicleId, imageUrl);
}

export async function deleteVehicleAction(vehicleId: string) {
  try {
    const result = await deleteVehicleFromDb(vehicleId);
    if (result.success) {
      revalidatePath('/vehicles');
      revalidatePath('/');
    }
    return result;
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return { success: false, message: 'Failed to delete vehicle.' };
  }
}

export async function addExpenseAction(expenseData: Omit<any, 'id'>) {
    try {
        await addExpenseToDb(expenseData);
        revalidatePath(`/vehicles/${expenseData.vehicleId}`);
        revalidatePath('/expenses');
        return { success: true };
    } catch(error) {
        console.error('Error adding expense:', error);
        return { success: false, message: 'Failed to add expense.' };
    }
}

export async function addMaintenanceAction(maintenanceData: Omit<MaintenanceTask, 'id' | 'expenseId'> & { totalCost?: number }) {
    try {
        let expenseId: string | undefined = undefined;
        if (maintenanceData.totalCost && maintenanceData.totalCost > 0) {
            const newExpense = await addExpenseToDb({
                vehicleId: maintenanceData.vehicleId,
                date: new Date().toISOString(),
                amount: maintenanceData.totalCost,
                description: maintenanceData.task,
                category: 'Maintenance',
            });
            expenseId = newExpense.id;
        }

        const newMaintenanceData = {
            ...maintenanceData,
            expenseId: expenseId,
        };
        
        await addMaintenanceToDb(newMaintenanceData);

        revalidatePath(`/vehicles/${maintenanceData.vehicleId}`);
        revalidatePath('/logs');
        revalidatePath('/expenses');
        return { success: true };
    } catch(error) {
        console.error('Error adding maintenance:', error);
        return { success: false, message: 'Failed to add maintenance.' };
    }
}

export async function addFuelLogAction(fuelLogData: Omit<FuelLog, 'id' | 'expenseId'>) {
    try {
        let expenseId: string | undefined = undefined;
        if (fuelLogData.totalCost > 0) {
             const newExpense = await addExpenseToDb({
                vehicleId: fuelLogData.vehicleId,
                date: fuelLogData.date,
                amount: fuelLogData.totalCost,
                description: `Fuel Fill-up (${fuelLogData.gallons} gal)`,
                category: 'Fuel',
            });
            expenseId = newExpense.id;
        }
        
        const newFuelLogData = {
            ...fuelLogData,
            expenseId: expenseId,
        };

        await addFuelLogToDb(newFuelLogData);
        revalidatePath(`/vehicles/${fuelLogData.vehicleId}`);
        revalidatePath('/expenses');
        return { success: true };
    } catch (error) {
        console.error('Error adding fuel log:', error);
        return { success: false, message: 'Failed to add fuel log.' };
    }
}

export async function addDocumentAction(docData: Omit<VehicleDocument, 'id'>) {
    try {
        await addDocument(docData);
        revalidatePath(`/vehicles/${docData.vehicleId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding document:', error);
        return { success: false, message: 'Failed to add document.' };
    }
}

export async function deleteDocumentAction(docId: string) {
    try {
        return await deleteDocumentFromDb(docId);
    } catch (error) {
        console.error('Error deleting document:', error);
        return { success: false, message: 'Failed to delete document.' };
    }
}
