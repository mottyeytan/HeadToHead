import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRoom } from "../hooks/useRoom";

interface RoomProps {
    gameId: string;
    playerName: string;
    onStartGame?: () => void;
    onLeaveRoom?: () => void;
}


export const Room = ({ gameId, playerName, onStartGame, onLeaveRoom }: RoomProps) => {
    const { players, error, isInRoom, canStartGame, leaveRoom } = useRoom({ roomId: gameId, playerName });

    // leave room when the component is unmounted
    useEffect(() => {
        return () => leaveRoom();
    }, [leaveRoom]);

    const handleLeaveRoom = () => {
        leaveRoom();
        onLeaveRoom?.();
    };

   
    return (
        <Box sx={{
            backgroundColor: "rgba(30, 60, 30, 0.6)",
            border: "1px solid rgba(46, 204, 113, 0.3)",
            borderRadius: "16px",
            padding: "20px",
        }}>
            {/* title */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupIcon sx={{ color: "#2ecc71", fontSize: "1.2rem" }} />
                    <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
                        שחקנים בחדר ({players.length})
                    </Typography>
                    
                </Box>
                {/* leave button */}
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

            {/* error */}
            {error && (
                <Typography sx={{ color: "#e74c3c", fontSize: "0.9rem", mb: 2 }}>
                    {error}
                </Typography>
            )}

            {/* players list */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                {players.length === 0 && !isInRoom ? (
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

            {/* waiting for players or start button */}
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
                    onClick={onStartGame}
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
