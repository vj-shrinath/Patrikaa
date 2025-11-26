"use client";

import { useState, useEffect } from 'react';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const generateSparkle = () => {
    const size = random(2, 5);
    const top = random(0, 100);
    const left = random(0, 100);
    const translateX = `translateX(${random(-200, 200)}px)`;
    const translateY = `translateY(${random(-200, 200)}px)`;
    const duration = random(2000, 4000);
    const delay = random(0, 3000);

    return {
        id: crypto.randomUUID(),
        style: {
            '--tw-translate-x': translateX,
            '--tw-translate-y': translateY,
            '--animation-duration': `${duration}ms`,
            top: `${top}%`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}ms`,
        } as React.CSSProperties,
    };
};

export function Sparkles() {
    const [sparkles, setSparkles] = useState<ReturnType<typeof generateSparkle>[]>([]);

    useEffect(() => {
        const allSparkles = Array.from({ length: 30 }, generateSparkle);
        setSparkles(allSparkles);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20">
            {sparkles.map((sparkle) => (
                <div key={sparkle.id} className="sparkle" style={sparkle.style} />
            ))}
        </div>
    );
}
