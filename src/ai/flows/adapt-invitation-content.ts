'use server';

/**
 * @fileOverview A flow that adapts invitation content based on user input, suggesting personalized messages and design adjustments considering Marathi cultural nuances.
 *
 * - adaptInvitationContent - A function that handles the adaptation of invitation content.
 * - AdaptInvitationContentInput - The input type for the adaptInvitationContent function.
 * - AdaptInvitationContentOutput - The return type for the adaptInvitationContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptInvitationContentInputSchema = z.object({
  brideName: z.string().describe('Bride\u2019s name in Marathi (Devanagari)'),
  groomName: z.string().describe('Groom\u2019s name in Marathi (Devanagari)'),
  mainDate: z.string().describe('Wedding date in Marathi (Devanagari)'),
  venueName: z.string().describe('Venue name in Marathi (Devanagari)'),
  userPrompt: z
    .string()
    .describe(
      'Any specific requests or preferences for the invitation content in Marathi (Devanagari)'
    ),
});
export type AdaptInvitationContentInput = z.infer<typeof AdaptInvitationContentInputSchema>;

const AdaptInvitationContentOutputSchema = z.object({
  suggestedMessage: z
    .string()
    .describe(
      'AI-suggested personalized invitation message considering Marathi cultural nuances in Marathi (Devanagari)'
    ),
  designAdjustments: z
    .string()
    .describe(
      'AI-suggested design adjustments to enhance content relevance in Marathi (Devanagari)'
    ),
});
export type AdaptInvitationContentOutput = z.infer<typeof AdaptInvitationContentOutputSchema>;

export async function adaptInvitationContent(
  input: AdaptInvitationContentInput
): Promise<AdaptInvitationContentOutput> {
  return adaptInvitationContentFlow(input);
}

const adaptInvitationContentPrompt = ai.definePrompt({
  name: 'adaptInvitationContentPrompt',
  input: {schema: AdaptInvitationContentInputSchema},
  output: {schema: AdaptInvitationContentOutputSchema},
  prompt: `You are an AI assistant specializing in creating personalized Marathi wedding invitations.

  Considering the following details and user requests, suggest a personalized invitation message and design adjustments.

  Bride Name: {{{brideName}}}
  Groom Name: {{{groomName}}}
  Wedding Date: {{{mainDate}}}
  Venue: {{{venueName}}}
  User Request: {{{userPrompt}}}

  Please provide a culturally relevant and personalized invitation message and design adjustments in Marathi.
  Remember to respond in Marathi.

  {outputFormat: json}
  `,
});

const adaptInvitationContentFlow = ai.defineFlow(
  {
    name: 'adaptInvitationContentFlow',
    inputSchema: AdaptInvitationContentInputSchema,
    outputSchema: AdaptInvitationContentOutputSchema,
  },
  async input => {
    const {output} = await adaptInvitationContentPrompt(input);
    return output!;
  }
);
