"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toPng } from 'html-to-image';
import { useToast } from "@/hooks/use-toast";

interface DownloadCardButtonProps {
    targetId: string;
    fileName?: string;
}

export function DownloadCardButton({ targetId, fileName = "wedding-invitation" }: DownloadCardButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const handleDownload = async () => {
        const element = document.getElementById(targetId);
        if (!element) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not find the card element to download.",
            });
            return;
        }

        setIsDownloading(true);
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

            const dataUrl = await toPng(element, {
                cacheBust: false, // cacheBust can cause CORS issues with some CDNs
                pixelRatio: 2, // Higher resolution
                skipAutoScale: true,
                onClone: onClone as any,
            });

            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();

            toast({
                title: "Success",
                description: "Invitation card downloaded successfully.",
            });
        } catch (error) {
            console.error("Download failed first attempt:", error);

            // Retry with skipFonts as a fallback if it's a security/CORS error
            try {
                console.log("Retrying with skipFonts...");
                const onClone = (clonedNode: HTMLElement) => {
                    const fadeElements = clonedNode.querySelectorAll('.fade-in-element');
                    fadeElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            el.style.opacity = '1';
                            el.style.transform = 'none';
                        }
                    });
                };

                const dataUrl = await toPng(element, {
                    cacheBust: false,
                    pixelRatio: 2,
                    skipAutoScale: true,
                    skipFonts: true, // Fallback: Use system fonts
                    onClone: onClone as any,
                });

                const link = document.createElement('a');
                link.download = `${fileName}-fallback.png`;
                link.href = dataUrl;
                link.click();

                toast({
                    title: "Downloaded (System Fonts)",
                    description: "Saved with system fonts due to security restrictions on custom fonts.",
                    duration: 5000,
                });
            } catch (retryError) {
                console.error("Retry failed:", retryError);
                toast({
                    variant: "destructive",
                    title: "Download Failed",
                    description: "Could not generate image even with fallbacks. Please try taking a screenshot instead.",
                });
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button variant="outline" onClick={handleDownload} disabled={isDownloading} className="gap-2">
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Card
        </Button>
    );
}
