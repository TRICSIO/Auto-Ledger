'use server';

/**
 * @fileOverview AI flow to check for vehicle recalls based on provided vehicle details.
 *
 * - checkVehicleRecall - Function to check for new vehicle recalls.
 * - CheckVehicleRecallInput - Input type for the checkVehicleRecall function.
 * - CheckVehicleRecallOutput - Return type for the checkVehicleRecall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckVehicleRecallInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.string().describe('The year of the vehicle.'),
  vin: z.string().optional().describe('The Vehicle Identification Number (VIN).'),
  lastCheckedRecall: z.string().optional().describe('The last checked recall description, for comparison against current recalls.'),
});
export type CheckVehicleRecallInput = z.infer<typeof CheckVehicleRecallInputSchema>;

const CheckVehicleRecallOutputSchema = z.object({
  hasNewRecall: z.boolean().describe('Indicates if there is a new recall.'),
  recallDescription: z.string().optional().describe('The description of the latest recall, if any.'),
  recallDate: z.string().optional().describe('The date of the recall in YYYY-MM-DD format.'),
  recommendation: z.string().optional().describe('Actionable advice or next steps for the user if a recall is found.'),
});
export type CheckVehicleRecallOutput = z.infer<typeof CheckVehicleRecallOutputSchema>;

export async function checkVehicleRecall(input: CheckVehicleRecallInput): Promise<CheckVehicleRecallOutput> {
  return checkVehicleRecallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkVehicleRecallPrompt',
  input: {schema: CheckVehicleRecallInputSchema},
  output: {schema: CheckVehicleRecallOutputSchema},
  prompt: `You are an AI assistant specializing in vehicle recalls. Your primary source for recall information is the National Highway Traffic Safety Administration (NHTSA).
  Given the following vehicle details:
  Make: {{{make}}}
  Model: {{{model}}}
  Year: {{{year}}}
  VIN: {{{vin}}}

  Your task is to determine if there are any new recalls for this vehicle.
  If a VIN is provided, you MUST use it to perform an exact search on the NHTSA database. This is the most accurate method.
  If no VIN is provided, use the make, model, and year.

  Compare any recalls you find with the last known recall description provided below to see if there is anything new.
  Last Checked Recall: {{{lastCheckedRecall}}}

  - If you find a new recall, set hasNewRecall to true, provide a concise summary in recallDescription, include the official recallDate (in YYYY-MM-DD format), and generate a clear, actionable recommendation in the recommendation field (e.g., "Contact your local dealership to schedule a free repair for the airbag inflator.").
  - If there are no new recalls, set hasNewRecall to false and leave the other fields blank.
  Ensure your response is accurate and based on the latest available information.
  `,
});

const checkVehicleRecallFlow = ai.defineFlow(
  {
    name: 'checkVehicleRecallFlow',
    inputSchema: CheckVehicleRecallInputSchema,
    outputSchema: CheckVehicleRecallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
