"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FallingLeaves() {
    const [leaves, setLeaves] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const leafCount = 15;
        const newLeaves = Array.from({ length: leafCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // Random horizontal position (0-100%)
            delay: Math.random() * 10, // Random delay
            duration: 10 + Math.random() * 10, // Random duration (10-20s)
        }));
        setLeaves(newLeaves);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {leaves.map((leaf) => (
                <motion.img
                    key={leaf.id}
                    src="/images/dry-leaf.svg"
                    alt=""
                    className="absolute w-8 h-8 opacity-70"
                    initial={{ y: -50, x: `${leaf.x}vw`, rotate: 0 }}
                    animate={{
                        y: "110vh",
                        x: [`${leaf.x}vw`, `${leaf.x + (Math.random() * 10 - 5)}vw`, `${leaf.x}vw`], // Slight horizontal sway
                        rotate: 360,
                    }}
                    transition={{
                        duration: leaf.duration,
                        delay: leaf.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
