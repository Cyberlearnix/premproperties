"use client";

import { useEffect, useRef, useState } from "react";

// Animates a stat string like "10+", "2,000+", "99%" by counting up its numeric part
// (with the original prefix/suffix preserved) once it scrolls into view.
export default function AnimatedCounter({
    value,
    duration = 1800,
    className,
}: {
    value: string;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(() => {
        const match = String(value ?? "").match(/[\d,.]+/);
        return match ? String(value).replace(match[0], "0") : value;
    });

    useEffect(() => {
        const raw = String(value ?? "");
        const match = raw.match(/[\d,.]+/);
        if (!match) {
            setDisplay(raw);
            return;
        }

        const numericStr = match[0].replace(/,/g, "");
        const target = parseFloat(numericStr);
        const hasDecimals = numericStr.includes(".");
        const prefix = raw.slice(0, match.index);
        const suffix = raw.slice((match.index || 0) + match[0].length);
        const el = ref.current;
        if (!el || isNaN(target)) {
            setDisplay(raw);
            return;
        }

        let animationFrame: number;
        let hasAnimated = false;

        const format = (n: number) =>
            hasDecimals ? n.toFixed(1) : Math.round(n).toLocaleString();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                        setDisplay(`${prefix}${format(target * eased)}${suffix}`);
                        if (progress < 1) animationFrame = requestAnimationFrame(tick);
                    };
                    animationFrame = requestAnimationFrame(tick);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrame);
        };
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
}
