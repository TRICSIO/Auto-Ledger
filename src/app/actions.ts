'use server';

import { checkVehicleRecall, type CheckVehicleRecallInput, type CheckVehicleRecallOutput } from '@/ai/flows/check-vehicle-recall';
import { predictVehicleIssues, type PredictVehicleIssuesInput, type PredictVehicleIssuesOutput } from '@/ai/flows/predict-vehicle-issues';
import { vehicles, deleteVehicle } from '@/lib/data'; // Using mock data for simulation

export async function checkVehicleRecallAction(input: CheckVehicleRecallInput): Promise<CheckVehicleRecallOutput> {
  try {
    const result = await checkVehicleRecall(input);
    
    // In a real app, you would update your database with the new recall description.
    // For this mock app, we simulate an update to our in-memory data.
    if (result.hasNewRecall && result.recallDescription) {
      console.log(`New recall found for ${input.make} ${input.model}. Recommendation: ${result.recommendation}`);
      const vehicleToUpdate = vehicles.find(v => v.vin === input.vin);
      if (vehicleToUpdate) {
        vehicleToUpdate.lastRecallCheck = result.recallDescription;
      }
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
    // Return an empty response or a specific error structure
    return {
      predictedFailures: [],
      proactiveReminders: [],
    };
  }
}

export async function deleteVehicleAction(vehicleId: string) {
  try {
    deleteVehicle(vehicleId);
    console.log(`Vehicle with ID: ${vehicleId} has been deleted.`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return { success: false, message: 'Failed to delete vehicle.' };
  }
}
