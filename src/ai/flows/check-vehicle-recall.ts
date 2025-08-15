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
});
export type CheckVehicleRecallOutput = z.infer<typeof CheckVehicleRecallOutputSchema>;

export async function checkVehicleRecall(input: CheckVehicleRecallInput): Promise<CheckVehicleRecallOutput> {
  return checkVehicleRecallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkVehicleRecallPrompt',
  input: {schema: CheckVehicleRecallInputSchema},
  output: {schema: CheckVehicleRecallOutputSchema},
  prompt: `You are an AI assistant specializing in vehicle recalls.
  Given the following vehicle details:
  Make: {{{make}}}
  Model: {{{model}}}
  Year: {{{year}}}
  VIN: {{{vin}}}

  Determine if there are any new recalls for this vehicle compared to the following last checked recall description:
  {{{lastCheckedRecall}}}

  If there is a new recall, provide the recall description and set hasNewRecall to true. If there are no new recalls, set hasNewRecall to false and leave recallDescription blank.
  Ensure that your response is concise and accurate.
  If the VIN is available, use it to find recalls from the NHTSA.
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
