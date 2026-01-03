import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSocket } from "../../../socket/hooks/useSocket";
import { SocketEvents } from "../../../../../../shared/events/socketEvents";
import type { Player } from "../../types/game.types";

interface RoomProps {
    gameId: string;
    playerName: string;
    onStartGame?: () => void;
    onLeaveRoom?: () => void;
}

export const Room = ({ gameId, playerName, onStartGame, onLeaveRoom }: RoomProps) => {
    const { socket, isConnected } = useSocket();
    const [players, setPlayers] = useState<Player[]>([]);
    const [isJoining, setIsJoining] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasJoined = useRef(false);

    const canStartGame = players.length >= 2;

    // הצטרפות לחדר
    useEffect(() => {
        if (!socket || !isConnected || !gameId || !playerName) return;
        if (hasJoined.current) return;

        socket.emit(SocketEvents.JOIN_ROOM, { roomId: gameId, playerName });
        hasJoined.current = true;
        setIsJoining(false);

    }, [socket, isConnected, gameId, playerName]);

    // יציאה מהחדר כשסוגרים את החלון (תומך גם במובייל)
    useEffect(() => {
        const leaveRoom = () => {
            if (socket && hasJoined.current) {
                socket.emit(SocketEvents.LEAVE_ROOM, { roomId: gameId });
                hasJoined.current = false;
            }
        };

        // Desktop - beforeunload
        const handleBeforeUnload = () => leaveRoom();

        // Mobile - pagehide (יותר אמין במובייל כשסוגרים טאב)
        const handlePageHide = (event: PageTransitionEvent) => {
            // persisted = false אומר שהדף באמת נסגר (לא בcache)
            if (!event.persisted) {
                leaveRoom();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("pagehide", handlePageHide);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("pagehide", handlePageHide);
            // יציאה מהחדר כשהקומפוננטה נהרסת
            leaveRoom();
        };
    }, [socket, gameId]);

    // האזנה לאירועים
    useEffect(() => {
        if (!socket) return;

        const handlePlayersUpdated = (data: { players: Player[] }) => {
            setPlayers(data.players);
            setIsJoining(false);
        };

        const handleRoomError = ({ message }: { message: string }) => {
            setError(message);
            setIsJoining(false);
        };

        socket.on(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
        socket.on(SocketEvents.ROOM_ERROR, handleRoomError);

        return () => {
            socket.off(SocketEvents.PLAYERS_UPDATED, handlePlayersUpdated);
            socket.off(SocketEvents.ROOM_ERROR, handleRoomError);
        };
    }, [socket]);

    const handleStartGame = () => {
        if (!socket || !canStartGame) return;
        socket.emit(SocketEvents.START_GAME, { roomId: gameId });
        onStartGame?.();
    };

    const handleLeaveRoom = () => {
        if (socket) {
            socket.emit(SocketEvents.LEAVE_ROOM, { roomId: gameId });
            hasJoined.current = false;
        }
        onLeaveRoom?.();
    };

    return (
        <Box sx={{
            backgroundColor: "rgba(30, 60, 30, 0.6)",
            border: "1px solid rgba(46, 204, 113, 0.3)",
            borderRadius: "16px",
            padding: "20px",
        }}>
            {/* כותרת */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupIcon sx={{ color: "#2ecc71", fontSize: "1.2rem" }} />
                    <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                        שחקנים בחדר ({players.length})
                    </Typography>
                    {isJoining && (
                        <CircularProgress size={16} sx={{ color: "#2ecc71", ml: 1 }} />
                    )}
                </Box>
                {/* כפתור יציאה */}
                <Button
                    onClick={handleLeaveRoom}
                    size="small"
                    startIcon={<ExitToAppIcon />}
                    sx={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "0.8rem",
                        textTransform: "none",
                        "&:hover": { color: "#e74c3c" },
                    }}
                >
                    יציאה
                </Button>
            </Box>

            {/* שגיאה */}
            {error && (
                <Typography sx={{ color: "#e74c3c", fontSize: "0.9rem", mb: 2 }}>
                    {error}
                </Typography>
            )}

            {/* רשימת שחקנים */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                {players.length === 0 && !isJoining ? (
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 2 }}>
                        מחכה לשחקנים...
                    </Typography>
                ) : (
                    players.map((player) => (
                        <Box 
                            key={player.id}
                            sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: 1.5,
                                py: 1,
                                px: 1.5,
                                backgroundColor: "rgba(255,255,255,0.05)",
                                borderRadius: "10px",
                            }}
                        >
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                backgroundColor: "rgba(46, 204, 113, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <PersonIcon sx={{ color: "#fff", fontSize: "1rem" }} />
                            </Box>
                            <Typography sx={{ color: "#fff", flex: 1 }}>
                                {player.name}
                            </Typography>
                        </Box>
                    ))
                )}
            </Box>

            {/* ממתין לשחקנים או כפתור התחל */}
            {!canStartGame ? (
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    gap: 1.5,
                    py: 2,
                    color: "rgba(255,255,255,0.6)",
                }}>
                    <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.4)" }} />
                    <Typography sx={{ fontSize: "0.9rem" }}>
                        ממתין לשחקן נוסף...
                    </Typography>
                </Box>
            ) : (
                <Button
                    variant="contained"
                    onClick={handleStartGame}
                    fullWidth
                    endIcon={<PlayArrowIcon />}
                    sx={{
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                        textTransform: "none",
                        "&:hover": {
                            transform: "scale(1.02)",
                        },
                        transition: "all 0.3s ease",
                    }}
                >
                    התחל משחק
                </Button>
            )}
        </Box>
    );
};
