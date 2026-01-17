import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRoom } from "../hooks/useRoom";

interface RoomProps {
    gameId: string;
    playerName: string;
    onStartGame?: () => void;
    onLeaveRoom?: () => void;
    onJoinError?: (message: string) => void;
}

export const Room = ({ gameId, playerName, onStartGame, onLeaveRoom, onJoinError }: RoomProps) => {
    const { players, error, isInRoom, canStartGame, leaveRoom, isHost } = useRoom({ roomId: gameId, playerName });
    const lastErrorRef = useRef<string | null>(null);

    useEffect(() => {
        if (!error) return;
        if (lastErrorRef.current === error) return;
        lastErrorRef.current = error;
        onJoinError?.(error);
    }, [error, onJoinError]);

    const handleLeaveRoom = () => {
        leaveRoom();
        onLeaveRoom?.();
    };

    return (
        <Box
            sx={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 2,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: players.length > 0 ? "#10b981" : "rgba(250, 250, 250, 0.3)",
                            boxShadow: players.length > 0 ? "0 0 8px rgba(16, 185, 129, 0.5)" : "none",
                            transition: "all 0.3s ease",
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "rgba(250, 250, 250, 0.9)",
                        }}
                    >
                        שחקנים
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: "rgba(250, 250, 250, 0.4)",
                            fontWeight: 400,
                        }}
                    >
                        ({players.length})
                    </Typography>
                </Box>

                <Button
                    onClick={handleLeaveRoom}
                    size="small"
                    startIcon={<LogoutIcon sx={{ fontSize: "0.9rem !important" }} />}
                    sx={{
                        color: "rgba(250, 250, 250, 0.4)",
                        fontSize: "0.8rem",
                        textTransform: "none",
                        fontWeight: 400,
                        padding: "4px 8px",
                        minWidth: "auto",
                        borderRadius: "8px",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            color: "#ef4444",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                        },
                    }}
                >
                    יציאה
                </Button>
            </Box>

            {/* Error Message */}
            {error && (
                <Box
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                >
                    <Typography sx={{ color: "#ef4444", fontSize: "0.85rem" }}>
                        {error}
                    </Typography>
                </Box>
            )}

            {/* Players List */}
            <Box sx={{ p: 2 }}>
                {players.length === 0 && !isInRoom ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(250, 250, 250, 0.3)",
                                    animation: "pulse 1.5s ease-in-out infinite",
                                    "@keyframes pulse": {
                                        "0%, 100%": { opacity: 0.3 },
                                        "50%": { opacity: 1 },
                                    },
                                }}
                            />
                            <Typography sx={{ color: "rgba(250, 250, 250, 0.4)", fontSize: "0.85rem" }}>
                                מחכה לשחקנים...
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {players.map((player, index) => (
                            <Box
                                key={player.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.25,
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                                    border: "1px solid rgba(255, 255, 255, 0.04)",
                                    animation: `slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                                    "@keyframes slideIn": {
                                        from: { opacity: 0, transform: "translateX(-12px)" },
                                        to: { opacity: 1, transform: "translateX(0)" },
                                    },
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                                    },
                                }}
                            >
                                {/* Avatar */}
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "10px",
                                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
                                        border: "1px solid rgba(16, 185, 129, 0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        color: "#10b981",
                                    }}
                                >
                                    {player.name.charAt(0).toUpperCase()}
                                </Box>

                                {/* Name */}
                                <Typography
                                    sx={{
                                        flex: 1,
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                        color: "#fafafa",
                                    }}
                                >
                                    {player.name}
                                </Typography>

                                {/* Host Badge */}
                                {index === 0 && (
                                    <Box
                                        sx={{
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: "6px",
                                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                                            border: "1px solid rgba(16, 185, 129, 0.2)",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "0.7rem",
                                                fontWeight: 500,
                                                color: "#10b981",
                                            }}
                                        >
                                            מארח
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Footer - Start Button or Waiting */}
            <Box
                sx={{
                    px: 2,
                    pb: 2,
                }}
            >
                {!canStartGame ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            py: 2,
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.04)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                gap: 0.5,
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(250, 250, 250, 0.4)",
                                        animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                                        "@keyframes bounce": {
                                            "0%, 80%, 100%": { transform: "scale(1)" },
                                            "40%": { transform: "scale(1.5)" },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography sx={{ color: "rgba(250, 250, 250, 0.5)", fontSize: "0.85rem" }}>
                            ממתין לשחקן נוסף
                        </Typography>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onStartGame}
                        disabled={!isHost}
                        fullWidth
                        endIcon={<PlayArrowIcon />}
                        sx={{
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "12px",
                            background: isHost
                                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                : "rgba(255, 255, 255, 0.05)",
                            textTransform: "none",
                            boxShadow: isHost ? "0 4px 20px rgba(16, 185, 129, 0.25)" : "none",
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                            "&:hover": {
                                transform: isHost ? "translateY(-2px)" : "none",
                                boxShadow: isHost ? "0 8px 30px rgba(16, 185, 129, 0.35)" : "none",
                            },
                            "&.Mui-disabled": {
                                background: "rgba(255, 255, 255, 0.05)",
                                color: "rgba(250, 250, 250, 0.5)",
                            },
                        }}
                    >
                        {isHost ? "התחל משחק" : "המארח מתחיל את המשחק"}
                    </Button>
                )}
            </Box>
        </Box>
    );
};
