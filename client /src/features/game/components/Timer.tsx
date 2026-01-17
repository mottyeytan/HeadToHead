import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef, useCallback } from "react";

interface TimerProps {
    remainingTime: number;
    maxTime?: number;
}

export const Timer = ({ remainingTime, maxTime = 15 }: TimerProps) => {
    const [displayTime, setDisplayTime] = useState(remainingTime);
    const [progress, setProgress] = useState(100);
    const animationRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(Date.now());
    const targetTimeRef = useRef<number>(remainingTime);
    const lastTickSoundRef = useRef<number>(-1);
    const audioContextRef = useRef<AudioContext | null>(null);

    const size = 88;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    const playTickSound = useCallback((isUrgent: boolean = false) => {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            if (isUrgent) {
                oscillator.frequency.value = 880;
                gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.12);
            } else {
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.06);
            }
        } catch {
            // Audio not supported
        }
    }, [getAudioContext]);

    const playEndSound = useCallback(() => {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const frequencies = [880, 660, 440];
            frequencies.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = ctx.currentTime + (i * 0.1);
                gainNode.gain.setValueAtTime(0.25, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.15);
            });
        } catch {
            // Audio not supported
        }
    }, [getAudioContext]);

    const getColor = () => {
        if (displayTime <= 3) return "#ef4444";
        if (displayTime <= 7) return "#f59e0b";
        return "#10b981";
    };

    useEffect(() => {
        if (displayTime <= 5 && displayTime > 0 && displayTime !== lastTickSoundRef.current) {
            lastTickSoundRef.current = displayTime;
            playTickSound(displayTime <= 3);
        }

        if (displayTime === 0 && lastTickSoundRef.current !== 0) {
            lastTickSoundRef.current = 0;
            playEndSound();
        }
    }, [displayTime, playTickSound, playEndSound]);

    useEffect(() => {
        if (remainingTime > 5) {
            lastTickSoundRef.current = -1;
        }
    }, [remainingTime]);

    useEffect(() => {
        targetTimeRef.current = remainingTime;
        lastUpdateRef.current = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = (now - lastUpdateRef.current) / 1000;
            const currentTime = Math.max(0, targetTimeRef.current - elapsed);

            setDisplayTime(Math.ceil(currentTime));
            setProgress((currentTime / maxTime) * 100);

            if (currentTime > 0) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [remainingTime, maxTime]);

    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = getColor();
    const isUrgent = displayTime <= 3 && displayTime > 0;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: size,
                    height: size,
                    animation: isUrgent ? "pulse 0.5s ease-in-out infinite" : "none",
                    "@keyframes pulse": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.05)" },
                    },
                }}
            >
                <svg
                    width={size}
                    height={size}
                    style={{ transform: "rotate(-90deg)" }}
                >
                    {/* Background track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.06)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Progress */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: "stroke 0.3s ease",
                            filter: isUrgent ? `drop-shadow(0 0 8px ${color})` : "none",
                        }}
                    />
                </svg>

                {/* Time display */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: color,
                            fontWeight: 700,
                            fontSize: "1.75rem",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            transition: "color 0.3s ease",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {displayTime}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
