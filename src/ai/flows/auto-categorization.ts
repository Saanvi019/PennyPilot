'use server';

/**
 * @fileOverview Expense auto-categorization AI agent.
 *
 * - autoCategorize - A function that handles the expense auto-categorization process.
 * - AutoCategorizeInput - The input type for the autoCategorize function.
 * - AutoCategorizeOutput - The return type for the autoCategorize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
  availableCategories: z
    .array(z.string())
    .describe('A list of available expense categories.'),
});
export type AutoCategorizeInput = z.infer<typeof AutoCategorizeInputSchema>;

const AutoCategorizeOutputSchema = z.object({
  category: z
    .string()
    .describe('The most likely category for the transaction.'),
  confidence: z
    .number()
    .describe('A confidence score (0-1) for the categorization.'),
});
export type AutoCategorizeOutput = z.infer<typeof AutoCategorizeOutputSchema>;

export async function autoCategorize(input: AutoCategorizeInput): Promise<AutoCategorizeOutput> {
  return autoCategorizeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizePrompt',
  input: {schema: AutoCategorizeInputSchema},
  output: {schema: AutoCategorizeOutputSchema},
  prompt: `You are an expert financial assistant specializing in categorizing expenses.

  Given the following transaction description and available categories, determine the most likely category for the transaction.
  Also, provide a confidence score (0-1) for your categorization.

  Transaction Description: {{{transactionDescription}}}
  Available Categories: {{#each availableCategories}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Ensure that the output is valid JSON format.
  `,
});

const autoCategorizeFlow = ai.defineFlow(
  {
    name: 'autoCategorizeFlow',
    inputSchema: AutoCategorizeInputSchema,
    outputSchema: AutoCategorizeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
