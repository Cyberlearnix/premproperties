"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FloatingWhatsApp() {
    const [position, setPosition] = useState({ bottom: 24, right: 24 });

    useEffect(() => {
        const moveButton = () => {
            // Random position within safe bounds
            const newBottom = Math.random() * 100 + 20; // 20-120px from bottom
            const newRight = Math.random() * 100 + 20;  // 20-120px from right
            setPosition({ bottom: newBottom, right: newRight });
        };

        // Move every 2 seconds
        const interval = setInterval(moveButton, 2000);
        return () => clearInterval(interval);
    }, []);

    const message = encodeURIComponent("Hi! I'm interested in buying a property. Can you help me?");

    return (
        <motion.a
            href={`https://wa.me/918977228322?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-50 w-14 h-14 hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
            aria-label="Chat on WhatsApp"
            animate={{
                bottom: `${position.bottom}px`,
                right: `${position.right}px`,
            }}
            transition={{
                duration: 1,
                ease: "easeInOut"
            }}
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-full h-full"
            />
        </motion.a>
    );
}
