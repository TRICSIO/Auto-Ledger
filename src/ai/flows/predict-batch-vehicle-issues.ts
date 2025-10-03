
'use server';

/**
 * @fileOverview AI flow to predict potential vehicle issues for a batch of vehicles.
 *
 * - predictBatchVehicleIssues - Function to predict potential component failures and suggest maintenance for multiple vehicles.
 * - PredictBatchVehicleIssuesInput - Input type for the function.
 * - PredictBatchVehicleIssuesOutput - Return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VehicleInfoSchema = z.object({
  id: z.string().describe('The unique identifier for the vehicle.'),
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.string().describe('The year of the vehicle.'),
  mileage: z.number().describe('The current mileage of the vehicle.'),
});

const RecommendedIntervalSchema = z.object({
  task: z.string().describe('The name of the maintenance task (e.g., "Oil Change", "Tire Rotation").'),
  intervalMiles: z.number().describe('The AI-recommended interval in miles for this task.'),
  reason: z.string().describe('A brief explanation for the recommended interval.'),
});

const VehicleRecommendationSchema = z.object({
  vehicleId: z.string().describe('The unique identifier for the vehicle.'),
  recommendedIntervals: z.array(RecommendedIntervalSchema).describe('A list of AI-recommended service intervals for this vehicle.'),
});

export const PredictBatchVehicleIssuesInputSchema = z.object({
  vehicles: z.array(VehicleInfoSchema),
});
export type PredictBatchVehicleIssuesInput = z.infer<typeof PredictBatchVehicleIssuesInputSchema>;


export const PredictBatchVehicleIssuesOutputSchema = z.object({
  recommendations: z.array(VehicleRecommendationSchema).describe('A list of recommendations for each vehicle.'),
});
export type PredictBatchVehicleIssuesOutput = z.infer<typeof PredictBatchVehicleIssuesOutputSchema>;


export async function predictBatchVehicleIssues(input: PredictBatchVehicleIssuesInput): Promise<PredictBatchVehicleIssuesOutput> {
  return predictBatchVehicleIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBatchVehicleIssuesPrompt',
  input: {schema: PredictBatchVehicleIssuesInputSchema},
  output: {schema: PredictBatchVehicleIssuesOutputSchema},
  prompt: `You are an expert AI mechanic. For the following list of vehicles, your task is to recommend optimal service intervals for critical tasks like "Oil Change" and "Tire Rotation".

  For each vehicle in the list, provide:
  1.  **vehicleId**: The original unique identifier for the vehicle.
  2.  **Recommended Intervals**: A list of AI-recommended service intervals. For each interval, include the task name, the recommended interval in miles (intervalMiles), and a brief reason for the recommendation, considering the vehicle's specific age, make, model, and common manufacturer guidelines.

  Vehicles:
  {{#each vehicles}}
  - Vehicle ID: {{{id}}}
    Make: {{{make}}}
    Model: {{{model}}}
    Year: {{{year}}}
    Mileage: {{{mileage}}}
  {{/each}}
  `,
});

const predictBatchVehicleIssuesFlow = ai.defineFlow(
  {
    name: 'predictBatchVehicleIssuesFlow',
    inputSchema: PredictBatchVehicleIssuesInputSchema,
    outputSchema: PredictBatchVehicleIssuesOutputSchema,
  },
  async input => {
    if (input.vehicles.length === 0) {
      return { recommendations: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
