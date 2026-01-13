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

    // SVG circle parameters
    const size = 100;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Initialize AudioContext
    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    // Play tick sound
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

            // Different sound for urgent (last 3 seconds)
            if (isUrgent) {
                oscillator.frequency.value = 880; // Higher pitch
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.15);
            } else {
                oscillator.frequency.value = 600; // Normal tick
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.08);
            }
        } catch (e) {
            console.log("Audio not supported");
        }
    }, [getAudioContext]);

    // Play end sound (time's up)
    const playEndSound = useCallback(() => {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Play a descending tone sequence
            const frequencies = [880, 660, 440];
            frequencies.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = ctx.currentTime + (i * 0.12);
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.2);
            });
        } catch (e) {
            console.log("Audio not supported");
        }
    }, [getAudioContext]);

    // Color based on remaining time
    const getColor = () => {
        if (displayTime <= 3) return "#ef4444"; // Red
        if (displayTime <= 7) return "#f59e0b"; // Orange
        return "#22c55e"; // Green
    };

    // Handle sound effects when displayTime changes
    useEffect(() => {
        // Only play sounds for seconds 1-5
        if (displayTime <= 5 && displayTime > 0 && displayTime !== lastTickSoundRef.current) {
            lastTickSoundRef.current = displayTime;
            playTickSound(displayTime <= 3);
        }
        
        // Play end sound when time reaches 0
        if (displayTime === 0 && lastTickSoundRef.current !== 0) {
            lastTickSoundRef.current = 0;
            playEndSound();
        }
    }, [displayTime, playTickSound, playEndSound]);

    // Reset sound ref when timer restarts
    useEffect(() => {
        if (remainingTime > 5) {
            lastTickSoundRef.current = -1;
        }
    }, [remainingTime]);

    // Smooth animation loop
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

    // Cleanup audio context on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = getColor();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
            }}
        >
            <Box sx={{ position: "relative", width: size, height: size }}>
                {/* SVG Circle */}
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
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth={strokeWidth}
                    />
                    
                    {/* Animated progress */}
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
                        }}
                    />
                </svg>

                {/* Time display inside */}
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
                        variant="h3"
                        sx={{
                            color: color,
                            fontWeight: "bold",
                            fontSize: "2.2rem",
                            lineHeight: 1,
                            transition: "color 0.3s ease",
                            // Pulse animation for last 3 seconds
                            animation: displayTime <= 3 && displayTime > 0 
                                ? "pulse 0.5s ease-in-out infinite" 
                                : "none",
                            "@keyframes pulse": {
                                "0%, 100%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.1)" },
                            },
                        }}
                    >
                        {displayTime}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
