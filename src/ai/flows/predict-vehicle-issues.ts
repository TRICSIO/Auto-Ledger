'use server';

/**
 * @fileOverview AI flow to predict potential vehicle issues and provide proactive maintenance reminders.
 *
 * - predictVehicleIssues - Function to predict potential component failures and suggest maintenance.
 * - PredictVehicleIssuesInput - Input type for the predictVehicleIssues function.
 * - PredictVehicleIssuesOutput - Return type for the predictVehicleIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictVehicleIssuesInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.string().describe('The year of the vehicle.'),
  mileage: z.number().describe('The current mileage of the vehicle.'),
});
export type PredictVehicleIssuesInput = z.infer<typeof PredictVehicleIssuesInputSchema>;

const PredictedFailureSchema = z.object({
  componentName: z.string().describe('The name of the component predicted to fail (e.g., "Timing Belt", "Water Pump").'),
  probability: z.enum(['Low', 'Medium', 'High']).describe('The likelihood of the failure occurring soon.'),
  reason: z.string().describe('A brief explanation for why this failure is predicted (e.g., "Common issue for this model around 80,000 miles").'),
  recommendation: z.string().describe('A clear, actionable recommendation for the user (e.g., "Inspect the timing belt during your next service and plan for replacement.").'),
});

const ProactiveReminderSchema = z.object({
  task: z.string().describe('The recommended proactive maintenance task (e.g., "Inspect Transmission Fluid").'),
  reason: z.string().describe('A brief explanation for the recommendation (e.g., "To ensure smooth shifting and prevent premature wear.").'),
  recommendation: z.string().describe('A clear, actionable recommendation for the user (eg., "Ask your mechanic to check the fluid level and condition at your next oil change.").'),
});

const PredictVehicleIssuesOutputSchema = z.object({
  predictedFailures: z.array(PredictedFailureSchema).describe('A list of potential component failures.'),
  proactiveReminders: z.array(ProactiveReminderSchema).describe('A list of proactive maintenance reminders.'),
});
export type PredictVehicleIssuesOutput = z.infer<typeof PredictVehicleIssuesOutputSchema>;

export async function predictVehicleIssues(input: PredictVehicleIssuesInput): Promise<PredictVehicleIssuesOutput> {
  return predictVehicleIssuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictVehicleIssuesPrompt',
  input: {schema: PredictVehicleIssuesInputSchema},
  output: {schema: PredictVehicleIssuesOutputSchema},
  prompt: `You are an expert AI mechanic. Based on the vehicle's make, model, year, and mileage, identify common potential component failures and suggest proactive maintenance reminders.
  
  Vehicle Information:
  Make: {{{make}}}
  Model: {{{model}}}
  Year: {{{year}}}
  Mileage: {{{mileage}}}
  
  Analyze this information and provide:
  1.  A list of 2-3 potential component failures that are common for this vehicle at its current mileage. For each, provide the component name, probability of failure, a reason, and a clear recommendation.
  2.  A list of 2-3 proactive maintenance reminders that go beyond standard interval-based tasks. For each, provide the task, the reason it's important, and a recommendation.

  Base your predictions on common knowledge about vehicle reliability, known issues for specific models, and typical wear-and-tear patterns.
  `,
});

const predictVehicleIssuesFlow = ai.defineFlow(
  {
    name: 'predictVehicleIssuesFlow',
    inputSchema: PredictVehicleIssuesInputSchema,
    outputSchema: PredictVehicleIssuesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
