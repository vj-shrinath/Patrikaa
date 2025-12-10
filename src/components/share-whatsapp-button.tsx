"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, Loader2 } from "lucide-react";
import { toBlob } from 'html-to-image';
import { useToast } from "@/hooks/use-toast";

interface ShareWhatsAppButtonProps {
    targetId: string;
    invitationId: string | null;
    brideName?: string;
    groomName?: string;
}

export function ShareWhatsAppButton({ targetId, invitationId, brideName = "Bride", groomName = "Groom" }: ShareWhatsAppButtonProps) {
    const [isSharing, setIsSharing] = useState(false);
    const { toast } = useToast();

    const handleShare = async () => {
        if (!invitationId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invitation ID not found. Please save first.",
            });
            return;
        }

        const element = document.getElementById(targetId);
        if (!element) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not find the card element to share.",
            });
            return;
        }

        setIsSharing(true);
        const shareUrl = `${window.location.origin}/invitation/${invitationId}`;
        const shareText = `You are cordially invited to the wedding of ${brideName} & ${groomName}. Click here to see the invitation: ${shareUrl}`;

        try {
            // Options to ensure better quality and handling of web fonts
            const onClone = (clonedNode: HTMLElement) => {
                const fadeElements = clonedNode.querySelectorAll('.fade-in-element');
                fadeElements.forEach((el) => {
                    if (el instanceof HTMLElement) {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    }
                });
            };

            const blob = await toBlob(element, {
                cacheBust: false,
                pixelRatio: 2,
                skipAutoScale: true,
                onClone: onClone as any,
            });

            if (!blob) throw new Error("Failed to generate image blob");

            const file = new File([blob], "invitation.png", { type: "image/png" });

            // Check for Web Share API support with file sharing
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Wedding Invitation',
                    text: shareText,
                    // url property removed to improve compatibility, as some apps ignore files if url is present
                });
                toast({
                    title: "Shared successfully",
                    description: "Invitation shared via WhatsApp/System Share.",
                });
            } else {
                // Fallback: Download image and open WhatsApp Web with text
                const link = document.createElement('a');
                link.download = `${brideName}-${groomName}-invite.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);

                // Copy text to clipboard for convenience
                try {
                    await navigator.clipboard.writeText(shareText);
                } catch (err) {
                    console.error("Clipboard copy failed", err);
                }

                toast({
                    title: "IMAGE SAVED! 📸",
                    description: "Please attach the downloaded image to your WhatsApp message. Text copied to clipboard!",
                    duration: 6000,
                });

                // Small delay to let the toast be seen and download start
                setTimeout(() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            }

        } catch (error) {
            console.error("Share failed:", error);

            // Fallback retry with system fonts if first attempt fails (likely CORS/Security)
            try {
                console.log("Retrying share with skipFonts...");
                const onClone = (clonedNode: HTMLElement) => {
                    const fadeElements = clonedNode.querySelectorAll('.fade-in-element');
                    fadeElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            el.style.opacity = '1';
                            el.style.transform = 'none';
                        }
                    });
                };

                const blob = await toBlob(element, {
                    cacheBust: false,
                    pixelRatio: 2,
                    skipAutoScale: true,
                    skipFonts: true,
                    onClone: onClone as any
                });

                if (!blob) throw new Error("Failed to generate fallback blob");

                const file = new File([blob], "invitation-fallback.png", { type: "image/png" });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Wedding Invitation',
                        text: shareText,
                        // url property removed
                    });
                } else {
                    const link = document.createElement('a');
                    link.download = `${brideName}-${groomName}-invite-fallback.png`;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);

                    // Copy text to clipboard for convenience
                    try {
                        await navigator.clipboard.writeText(shareText);
                    } catch (err) {
                        console.error("Clipboard copy failed", err);
                    }

                    toast({
                        title: "IMAGE SAVED! (System Fonts) 📸",
                        description: "Please attach the downloaded image to your WhatsApp message. Text copied to clipboard!",
                        duration: 6000,
                    });

                    setTimeout(() => {
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                        window.open(whatsappUrl, '_blank');
                    }, 2000);
                }

            } catch (retryError) {
                console.error("Retry share failed:", retryError);
                toast({
                    variant: "destructive",
                    title: "Share Failed",
                    description: "Could not generate image. Please send the link manually.",
                });
                // Last resort: just open WhatsApp with the text
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                window.open(whatsappUrl, '_blank');
            }

        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleShare} disabled={isSharing} className="gap-2 border-green-600 text-green-600 hover:text-green-700 hover:bg-green-50">
            {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
            Share
        </Button>
    );
}
