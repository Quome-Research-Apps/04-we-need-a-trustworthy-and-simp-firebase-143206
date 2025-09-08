'use server';

/**
 * @fileOverview This file defines a Genkit flow for comparing the current time with scheduled medication times
 * and emitting a warning if a medication time is past.
 *
 * - `medicationTimeWarnings` - A function that checks for overdue medications and returns a warning message.
 * - `MedicationTimeWarningsInput` - The input type for the `medicationTimeWarnings` function.
 * - `MedicationTimeWarningsOutput` - The return type for the `medicationTimeWarnings` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSchema = z.object({
  name: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication.'),
  scheduledTime: z.string().describe('The scheduled time for the medication in HH:mm format (e.g., 08:00, 14:30).'),
});

const MedicationTimeWarningsInputSchema = z.object({
  medications: z.array(MedicationSchema).describe('An array of medication objects with name, dosage, and scheduled time.'),
  currentTime: z.string().describe('The current time in HH:mm format (e.g., 08:15, 15:00).'),
});

export type MedicationTimeWarningsInput = z.infer<typeof MedicationTimeWarningsInputSchema>;

const MedicationTimeWarningsOutputSchema = z.object({
  warningMessage: z.string().describe('A warning message indicating which medications are overdue, or an empty string if no medications are overdue.'),
});

export type MedicationTimeWarningsOutput = z.infer<typeof MedicationTimeWarningsOutputSchema>;

export async function medicationTimeWarnings(input: MedicationTimeWarningsInput): Promise<MedicationTimeWarningsOutput> {
  return medicationTimeWarningsFlow(input);
}

const medicationTimeWarningsPrompt = ai.definePrompt({
  name: 'medicationTimeWarningsPrompt',
  input: {schema: MedicationTimeWarningsInputSchema},
  output: {schema: MedicationTimeWarningsOutputSchema},
  prompt: `You are a helpful assistant that checks if medications are overdue based on the current time.

You will be given a list of medications with their scheduled times and the current time.

Your task is to determine if any medications are overdue. A medication is considered overdue if its scheduled time is earlier than the current time.

If there are overdue medications, create a warning message that lists the names of the overdue medications.
If no medications are overdue, return an empty string.

Medications:
{{#each medications}}
  - Name: {{this.name}}, Dosage: {{this.dosage}}, Scheduled Time: {{this.scheduledTime}}
{{/each}}

Current Time: {{currentTime}}

Warning Message:`,
});

const medicationTimeWarningsFlow = ai.defineFlow(
  {
    name: 'medicationTimeWarningsFlow',
    inputSchema: MedicationTimeWarningsInputSchema,
    outputSchema: MedicationTimeWarningsOutputSchema,
  },
  async input => {
    const {output} = await medicationTimeWarningsPrompt(input);
    return output!;
  }
);
