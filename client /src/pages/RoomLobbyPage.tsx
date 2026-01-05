import { Box,  Container, Typography } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import { games } from "../features/questions/data/categories";
import routes from "../global/router/model/routes.model";
import { Room } from "../features/room/components/Room";
import { GuestSection } from "../features/room/components/GuestSection";
import { InviteSection } from "../features/room/components/InviteSection";

// יצירת מזהה ייחודי לחדר
const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const RoomLobbyPage = () => {
    const { gameId, roomId: urlRoomId, inviterName } = useParams();
    const navigate = useNavigate();
    const game = games[gameId as keyof typeof games] || null;
    
    // check if it is a guest (came from invite link with inviter name)
    const isGuest = !!inviterName;
    
    // create unique roomId if not exists in URL (for new host)
    const roomId = useMemo(() => {
        return urlRoomId || generateRoomId();
    }, [urlRoomId]);
    
    // if host and no roomId in URL - navigate to the address with the roomId
    useEffect(() => {
        if (!isGuest && !urlRoomId && gameId) {
            const newPath = routes.gameRoom
                .replace(":gameId", gameId)
                .replace(":roomId", roomId);
            navigate(newPath, { replace: true });
        }
    }, [isGuest, urlRoomId, gameId, roomId, navigate]);
    
    // player name
    const hostName = inviterName || localStorage.getItem("playerName") || "אורח";
    const [guestName, setGuestName] = useState(isGuest ? "" : hostName);
    const [hasJoined, setHasJoined] = useState(false);
    const currentPlayerName = isGuest ? guestName : hostName;
    
    const handleBack = () => {
        navigate(routes.gameLobby.replace(":gameId", gameId || ""));
    };

    const handlePlayAlone = () => {
        navigate(routes.gamePlay.replace(":gameId", gameId || ""));
    };

    const handleStartGame = () => {
        navigate(routes.gamePlay.replace(":gameId", gameId || ""));
    };

    const handleJoinRoom = (name: string) => {
        if (name.trim()) {
            localStorage.setItem("playerName", name);
            setGuestName(name);
            setHasJoined(true);
        }
    };

    return (
        <Container maxWidth={false} sx={{ 
            padding: "24px", 
            maxWidth: "500px", 
            margin: "0 auto", 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px",
            minHeight: "100vh",
        }}>
            {/* כפתור יציאה */}
            <ArrowBackIcon 
                onClick={handleBack}
                sx={{ 
                    fontSize: "1.5rem", 
                    color: "#fff", 
                    transform: "rotate(180deg)", 
                    alignSelf: "flex-start", 
                    cursor: "pointer" 
                }} 
            />

            {/* title - player name and game title */}
            <Box sx={{ 
                textAlign: "center",
                backgroundColor: "rgba(30, 60, 30, 0.6)",
                border: "1px solid rgba(46, 204, 113, 0.3)",
                borderRadius: "20px",
                padding: "15px",
                backdropFilter: "blur(10px)",
            }}>
                <Typography sx={{ fontSize: "3rem", mb: 1 }}>
                    {game?.icon}
                </Typography>
                
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                    {game?.title}
                </Typography>
                
                {isGuest && !hasJoined ? (
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                        {inviterName} מזמין אותך למשחק!
                    </Typography>
                ) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <PersonIcon sx={{ color: "#2ecc71", fontSize: "1.2rem" }} />
                        <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
                            {currentPlayerName}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* guest - join form */}
            {isGuest && !hasJoined && (
                <GuestSection onJoinRoom={handleJoinRoom} />
            )}

            {/* guest - after joining - show the room */}
            {isGuest && hasJoined && roomId && (
                <Room 
                    gameId={roomId}
                    playerName={currentPlayerName} 
                    onStartGame={handleStartGame}
                    onLeaveRoom={handleBack}
                />
            )}

            {/* not guest - automatically join the room (only if roomId is in URL) */}
            {!isGuest && urlRoomId && (
                <>
                    <Room 
                        gameId={roomId}
                        playerName={hostName} 
                        onStartGame={handleStartGame}
                        onLeaveRoom={handleBack}
                    />

            {/* share buttons */}
            <InviteSection roomId={roomId} />
                    
            {/* separator and play alone */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(46, 204, 113, 0.3)" }} />
                <Typography sx={{ color: "rgba(46, 204, 113, 0.7)" }}>או</Typography>
                <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(46, 204, 113, 0.3)" }} />
            </Box>

            <Box 
                onClick={handlePlayAlone}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    py: 1.5,
                    cursor: "pointer",
                    opacity: 0.8,
                    "&:hover": { opacity: 1 },
                    transition: "opacity 0.3s ease",
                }}
            >
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                    שחק לבד
                </Typography>
                <ArrowBackIcon 
                    sx={{ 
                        fontSize: "1rem", 
                        color: "rgba(255,255,255,0.7)",
                        animation: "slideArrow 1.5s ease-in-out infinite",
                        "@keyframes slideArrow": {
                            "0%, 100%": { transform: "translateX(0)" },
                            "50%": { transform: "translateX(-5px)" },
                        },
                    }} 
                />
            </Box>
        </>
    )}

           
        </Container>
    )
}
