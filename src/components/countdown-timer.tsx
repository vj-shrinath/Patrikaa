"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    targetDate: string;
    className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };

        // Calculate immediately
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    const timeBlocks = [
        { label: "दिवस", value: timeLeft.days },
        { label: "तास", value: timeLeft.hours },
        { label: "मिनिटे", value: timeLeft.minutes },
        { label: "सेकंद", value: timeLeft.seconds },
    ];

    return (
        <div className={cn("flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-2xl mx-auto my-6 sm:my-8", className)}>
            {timeBlocks.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* Glassmorphism card effect */}
                    <div className="w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                        <span className="text-lg sm:text-3xl font-bold text-primary-foreground drop-shadow-md font-mono">
                            {String(item.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className="mt-1 sm:mt-2 text-[10px] sm:text-sm font-medium text-primary-foreground/80 uppercase tracking-widest">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
