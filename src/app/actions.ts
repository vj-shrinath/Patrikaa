"use server";

import { adaptInvitationContent, type AdaptInvitationContentInput, type AdaptInvitationContentOutput } from "@/ai/flows/adapt-invitation-content";

export async function adaptInvitationContentAction(input: AdaptInvitationContentInput): Promise<AdaptInvitationContentOutput | null> {
    try {
        const output = await adaptInvitationContent(input);
        return output;
    } catch (error) {
        console.error("Error in adaptInvitationContentAction: ", error);
        return null;
    }
}
