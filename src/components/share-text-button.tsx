"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Copy, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InvitationData } from '@/lib/initial-data';

interface ShareTextButtonProps {
    data: InvitationData;
    invitationId: string | null;
}

export function ShareTextButton({ data, invitationId }: ShareTextButtonProps) {
    const [isSharing, setIsSharing] = useState(false);
    const { toast } = useToast();

    const generateText = () => {
        const shareUrl = invitationId ? `${window.location.origin}/invitation/${invitationId}` : window.location.origin;

        // Construct a structured text invitation
        // Note: Month is currently hardcoded in the template as 'July' (Jule), 
        // but we rely on data provided. If data doesn't have month, we format without it or implies it.
        // We will format as cleanly as possible with available data.

        let text = `✨ *Wedding Invitation* ✨\n\n`;
        text += `You are cordially invited to the wedding of\n`;
        text += `*${data.brideName}* & *${data.groomName}*\n\n`;

        text += `📅 *Date:* ${data.mainDay}, ${data.mainDate} ${data.mainYear}\n`;
        text += `⏰ *Time:* ${data.mainTime}\n\n`;

        text += `📍 *Venue:*\n${data.venueName}\n${data.venueCity}\n`;
        if (data.venueMapLink) {
            text += `🗺️ Map: ${data.venueMapLink}\n\n`;
        }

        text += `--------------\n`;
        text += `*Events Schedule:*\n`;
        data.schedule.forEach(event => {
            text += `• *${event.name}*: ${event.details}\n`;
        });
        text += `\n`;

        text += `Tap below to view the full invitation card & photos:\n`;
        text += `👇👇👇\n`;
        text += `${shareUrl}\n`;

        return text;
    };

    const handleShare = async () => {
        setIsSharing(true);
        const text = generateText();

        try {
            if (navigator.share && navigator.canShare && navigator.canShare({ text })) {
                await navigator.share({
                    title: 'Wedding Invitation',
                    text: text,
                });
                toast({
                    title: "Shared successfully",
                    description: "Invitation text shared.",
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(text);
                toast({
                    title: "Copied to Clipboard!",
                    description: "Invitation text copied. You can now paste it in WhatsApp or SMS.",
                });
            }
        } catch (error) {
            console.error("Sharing failed:", error);
            // Fallback if navigator.share fails (e.g. user cancelled)
            try {
                await navigator.clipboard.writeText(text);
                toast({
                    title: "Copied to Clipboard!",
                    description: "Invitation text copied.",
                });
            } catch (clipboardError) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not share or copy text.",
                });
            }
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleShare} disabled={isSharing} className="gap-2 border-blue-600 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <FileText className="h-4 w-4" />
            Copy/Share Text
        </Button>
    );
}
