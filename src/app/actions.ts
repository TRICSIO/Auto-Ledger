
'use server';

import { checkVehicleRecall, type CheckVehicleRecallInput, type CheckVehicleRecallOutput } from '@/ai/flows/check-vehicle-recall';
import { predictVehicleIssues, type PredictVehicleIssuesInput, type PredictVehicleIssuesOutput } from '@/ai/flows/predict-vehicle-issues';
import { predictBatchVehicleIssues, type PredictBatchVehicleIssuesOutput, type PredictBatchVehicleIssuesInput } from '@/ai/flows/predict-batch-vehicle-issues';
import * as data from '@/lib/data';
import type { Vehicle, FuelLog, VehicleDocument, MaintenanceTask, Expense } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// The revalidatePath calls below are technically not needed when using localStorage
// as the UI updates reactively, but they are kept here as good practice for server-actions
// and for a potential future switch to a server-based database.

export async function checkVehicleRecallAction(input: CheckVehicleRecallInput): Promise<CheckVehicleRecallOutput> {
  try {
    const result = await checkVehicleRecall(input);
    if (result.hasNewRecall) {
      // In a real DB scenario, we would update the vehicle record here.
      // For localStorage, this is handled on the client, but we revalidate for consistency.
      revalidatePath(`/vehicles/${input.vin}`); 
    }
    return result;
  } catch (error) {
    console.error('Error checking vehicle recall:', error);
    // It's better to return a structured error
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

export async function predictBatchVehicleIssuesAction(input: PredictBatchVehicleIssuesInput): Promise<PredictBatchVehicleIssuesOutput> {
  try {
    const result = await predictBatchVehicleIssues(input);
    return result;
  } catch (error) {
    console.error('Error predicting batch vehicle issues:', error);
    return {
      recommendations: [],
    };
  }
}


export async function addVehicleAction(vehicleData: Omit<Vehicle, 'id' | 'userId' | 'lastRecallCheck'>) {
    try {
        const newVehicle = data.addVehicle(vehicleData);
        revalidatePath('/vehicles');
        revalidatePath('/');
        return { success: true, vehicle: newVehicle };
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return { success: false, message: 'Failed to add vehicle.' };
    }
}

export async function updateVehicleAction(vehicleId: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'userId'>>) {
    try {
        const updatedVehicle = data.updateVehicle(vehicleId, vehicleData);
        revalidatePath(`/vehicles/${vehicleId}`);
        revalidatePath('/vehicles');
        revalidatePath('/');
        return { success: true, vehicle: updatedVehicle };
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return { success: false, message: 'Failed to update vehicle.' };
    }
}

export async function updateVehicleImageAction(vehicleId: string, imageUrl: string) {
    try {
        const result = data.updateVehicleImage(vehicleId, imageUrl);
        revalidatePath(`/vehicles/${vehicleId}`);
        return result;
    } catch (error) {
        console.error('Error updating vehicle image:', error);
        return { success: false, message: 'Failed to update image.' };
    }
}

export async function deleteVehicleAction(vehicleId: string) {
  try {
    data.deleteVehicle(vehicleId);
    revalidatePath('/vehicles');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete vehicle: ${message}` };
  }
}

export async function addExpenseAction(expenseData: Omit<Expense, 'id' | 'userId'>) {
    try {
        data.addExpense(expenseData);
        revalidatePath(`/vehicles/${expenseData.vehicleId}`);
        revalidatePath('/expenses');
        return { success: true };
    } catch(error) {
        console.error('Error adding expense:', error);
        return { success: false, message: 'Failed to add expense.' };
    }
}

export async function updateExpenseAction(expenseId: string, expenseData: Partial<Omit<Expense, 'id' | 'userId'>>) {
    try {
        const updatedExpense = data.updateExpense(expenseId, expenseData);
        revalidatePath(`/vehicles/${updatedExpense.vehicleId}`);
        revalidatePath('/expenses');
        revalidatePath('/logs');
        return { success: true, expense: updatedExpense };
    } catch (error) {
        console.error('Error updating expense:', error);
        return { success: false, message: 'Failed to update expense.' };
    }
}

export async function deleteExpenseAction(expenseId: string) {
    try {
        const result = data.deleteExpense(expenseId);
        if (result.success && result.vehicleId) {
            revalidatePath(`/vehicles/${result.vehicleId}`);
            revalidatePath('/expenses');
            revalidatePath('/logs');
        }
        return result;
    } catch (error) {
        console.error('Error deleting expense:', error);
        return { success: false, message: 'Failed to delete expense.' };
    }
}


export async function addMaintenanceTaskAction(maintenanceData: Omit<MaintenanceTask, 'id' | 'userId' | 'expenseId'> & { date: string, totalCost?: number }) {
    try {
        let expenseId: string | undefined = undefined;
        // If a cost is provided, create a corresponding expense record
        if (maintenanceData.totalCost && maintenanceData.totalCost > 0) {
            const newExpense = data.addExpense({
                vehicleId: maintenanceData.vehicleId,
                date: maintenanceData.date,
                amount: maintenanceData.totalCost,
                description: maintenanceData.task,
                category: 'Maintenance',
            });
            expenseId = newExpense.id;
        }

        const newMaintenanceData = {
            vehicleId: maintenanceData.vehicleId,
            task: maintenanceData.task,
            lastPerformedMileage: maintenanceData.lastPerformedMileage,
            intervalMileage: maintenanceData.intervalMileage,
            expenseId: expenseId,
        };
        
        data.addMaintenanceTask(newMaintenanceData);

        revalidatePath(`/vehicles/${maintenanceData.vehicleId}`);
        revalidatePath('/logs');
        revalidatePath('/expenses');
        return { success: true };
    } catch(error) {
        console.error('Error adding maintenance task:', error);
        return { success: false, message: 'Failed to add maintenance task.' };
    }
}

export async function updateMaintenanceTaskAction(taskId: string, taskData: Partial<Omit<MaintenanceTask, 'id'|'userId'>> & { date?: string, totalCost?: number }) {
    try {
        const result = data.updateMaintenanceTask(taskId, taskData);
        if (result.success && result.task) {
            revalidatePath(`/vehicles/${result.task.vehicleId}`);
            revalidatePath('/logs');
            revalidatePath('/expenses');
        }
        return result;
    } catch(error) {
        console.error('Error updating maintenance task:', error);
        return { success: false, message: 'Failed to update maintenance task.' };
    }
}


export async function deleteMaintenanceTaskAction(taskId: string) {
    try {
        const result = data.deleteMaintenanceTask(taskId);
        if (result.success && result.vehicleId) {
            revalidatePath(`/vehicles/${result.vehicleId}`);
            revalidatePath('/logs');
            if (result.expenseId) {
                revalidatePath('/expenses');
            }
        }
        return result;
    } catch (error) {
        console.error('Error deleting maintenance task:', error);
        return { success: false, message: 'Failed to delete maintenance task.' };
    }
}

export async function addFuelLogAction(fuelLogData: Omit<FuelLog, 'id' |'userId'| 'expenseId'>) {
    try {
        let expenseId: string | undefined = undefined;
        // Every fuel log creates an expense record.
        if (fuelLogData.totalCost > 0) {
             const newExpense = data.addExpense({
                vehicleId: fuelLogData.vehicleId,
                date: fuelLogData.date,
                amount: fuelLogData.totalCost,
                description: `Fuel Fill-up (${fuelLogData.gallons.toFixed(2)} gal)`,
                category: 'Fuel',
            });
            expenseId = newExpense.id;
        }
        
        const newFuelLogData = {
            ...fuelLogData,
            expenseId: expenseId,
        };

        data.addFuelLog(newFuelLogData);
        revalidatePath(`/vehicles/${fuelLogData.vehicleId}`);
        revalidatePath('/expenses');
        revalidatePath('/fuel');
        return { success: true };
    } catch (error) {
        console.error('Error adding fuel log:', error);
        return { success: false, message: 'Failed to add fuel log.' };
    }
}

export async function updateFuelLogAction(logId: string, logData: Partial<Omit<FuelLog, 'id'|'userId'>>) {
    try {
        const result = data.updateFuelLog(logId, logData);
        if (result.success && result.log) {
            revalidatePath(`/vehicles/${result.log.vehicleId}`);
            revalidatePath('/expenses');
            revalidatePath('/fuel');
        }
        return result;
    } catch (error) {
        console.error('Error updating fuel log:', error);
        return { success: false, message: 'Failed to update fuel log.' };
    }
}

export async function deleteFuelLogAction(fuelLogId: string) {
    try {
        const result = data.deleteFuelLog(fuelLogId);
        if (result.success && result.vehicleId) {
            revalidatePath(`/vehicles/${result.vehicleId}`);
            revalidatePath('/fuel');
             if (result.expenseId) {
                revalidatePath('/expenses');
            }
        }
        return result;
    } catch (error) {
        console.error('Error deleting fuel log:', error);
        return { success: false, message: 'Failed to delete fuel log.' };
    }
}


export async function addDocumentAction(docData: Omit<VehicleDocument, 'id'| 'userId'>) {
    try {
        data.addDocument(docData);
        revalidatePath(`/vehicles/${docData.vehicleId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding document:', error);
        return { success: false, message: 'Failed to add document.' };
    }
}

export async function deleteDocumentAction(docId: string) {
    try {
        return data.deleteDocument(docId);
    } catch (error) {
        console.error('Error deleting document:', error);
        return { success: false, message: 'Failed to delete document.' };
    }
}
