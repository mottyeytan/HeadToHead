import { Box, Container, Typography, Snackbar, Alert, IconButton } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { games } from "../features/questions/data/categories";
import routes from "../global/router/model/routes.model";
import { Room } from "../features/room/components/Room";
import { GuestSection } from "../features/room/components/GuestSection";
import { InviteSection } from "../features/room/components/InviteSection";
import { useGame } from "../features/game/hooks/useGame";

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const RoomLobbyPage = () => {
    const { gameId, roomId: urlRoomId, inviterName } = useParams();
    const navigate = useNavigate();
    const game = games[gameId as keyof typeof games] || null;

    const isGuest = !!inviterName;

    const roomId = useMemo(() => {
        return urlRoomId || generateRoomId();
    }, [urlRoomId]);

    const { startGame, gameStarted } = useGame(roomId as string)

    useEffect(() => {
        if (!isGuest && !urlRoomId && gameId) {
            const newPath = routes.gameRoom
                .replace(":gameId", gameId)
                .replace(":roomId", roomId);
            navigate(newPath, { replace: true });
        }
    }, [isGuest, urlRoomId, gameId, roomId, navigate]);

    useEffect(() => {
        if (gameStarted && gameId) {
            navigate(routes.gamePlay.replace(":gameId", gameId).replace(":roomId", roomId));
        }
    }, [gameStarted, gameId, roomId, navigate]);

    const hostName = inviterName || localStorage.getItem("playerName") || "אורח";
    const [guestName, setGuestName] = useState(isGuest ? "" : hostName);
    const [hasJoined, setHasJoined] = useState(false);
    const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);
    const currentPlayerName = isGuest ? guestName : hostName;

    const handleBack = () => {
        navigate(routes.gameLobby.replace(":gameId", gameId || ""));
    };

    const handlePlayAlone = () => {
        navigate(routes.gamePlay.replace(":gameId", gameId || "").replace(":roomId", roomId));
    };

    const handleStartGame = () => {
        startGame(game?.id as string, roomId);
    };

    const handleJoinRoom = (name: string) => {
        if (name.trim()) {
            localStorage.setItem("playerName", name);
            setGuestName(name);
            setHasJoined(true);
        }
    };

    const handleJoinError = (message: string) => {
        setJoinErrorMessage(message);
        setHasJoined(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                animation: "fadeIn 0.5s ease-out",
                "@keyframes fadeIn": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    maxWidth: "480px",
                    py: { xs: 3, sm: 4 },
                    px: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    flex: 1,
                }}
            >
                {/* Error Snackbar */}
                <Snackbar
                    open={!!joinErrorMessage}
                    autoHideDuration={3500}
                    onClose={() => setJoinErrorMessage(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setJoinErrorMessage(null)}
                        severity="error"
                        variant="filled"
                        sx={{
                            backgroundColor: "rgba(239, 68, 68, 0.95)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "12px",
                        }}
                    >
                        {joinErrorMessage}
                    </Alert>
                </Snackbar>

                {/* Back Button */}
                <IconButton
                    onClick={handleBack}
                    sx={{
                        alignSelf: "flex-start",
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        color: "rgba(250, 250, 250, 0.6)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            color: "#fafafa",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}
                >
                    <ArrowForwardIcon sx={{ fontSize: "1.25rem" }} />
                </IconButton>

                {/* Game Info Header */}
                <Box
                    sx={{
                        textAlign: "center",
                        py: 4,
                        px: 3,
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        animation: "fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
                        "@keyframes fadeInDown": {
                            from: { opacity: 0, transform: "translateY(-16px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                        },
                    }}
                >
                    {/* Game Icon */}
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 72,
                            height: 72,
                            borderRadius: "18px",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            fontSize: "2.25rem",
                            mb: 2.5,
                        }}
                    >
                        {game?.icon}
                    </Box>

                    {/* Game Title */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: "1.35rem",
                            fontWeight: 600,
                            color: "#fafafa",
                            mb: 1.5,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {game?.title}
                    </Typography>

                    {/* Player Info or Invitation */}
                    {isGuest && !hasJoined ? (
                        <Typography
                            sx={{
                                color: "rgba(250, 250, 250, 0.6)",
                                fontSize: "0.95rem",
                            }}
                        >
                            <Box
                                component="span"
                                sx={{ color: "#10b981", fontWeight: 500 }}
                            >
                                {inviterName}
                            </Box>
                            {" "}מזמין אותך למשחק
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                                px: 2,
                                py: 0.75,
                                borderRadius: "8px",
                                background: "rgba(16, 185, 129, 0.1)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: "#10b981",
                                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                                }}
                            />
                            <Typography
                                sx={{
                                    color: "#10b981",
                                    fontSize: "0.9rem",
                                    fontWeight: 500,
                                }}
                            >
                                {currentPlayerName}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Guest Join Form */}
                {isGuest && !hasJoined && (
                    <Box
                        sx={{
                            animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                            "@keyframes fadeInUp": {
                                from: { opacity: 0, transform: "translateY(16px)" },
                                to: { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        <GuestSection onJoinRoom={handleJoinRoom} />
                    </Box>
                )}

                {/* Room Section (Guest after joining) */}
                {isGuest && hasJoined && roomId && (
                    <Box
                        sx={{
                            animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        <Room
                            gameId={roomId}
                            playerName={currentPlayerName}
                            onStartGame={handleStartGame}
                            onLeaveRoom={handleBack}
                            onJoinError={handleJoinError}
                        />
                    </Box>
                )}

                {/* Host View */}
                {!isGuest && urlRoomId && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* Room Component */}
                        <Box
                            sx={{
                                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
                                "@keyframes fadeInUp": {
                                    from: { opacity: 0, transform: "translateY(16px)" },
                                    to: { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Room
                                gameId={roomId}
                                playerName={hostName}
                                onStartGame={handleStartGame}
                                onLeaveRoom={handleBack}
                            />
                        </Box>

                        {/* Invite Section */}
                        <Box
                            sx={{
                                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
                            }}
                        >
                            <InviteSection roomId={roomId} />
                        </Box>

                        {/* Divider */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
                            }}
                        >
                            <Box sx={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />
                            <Typography sx={{ color: "rgba(250, 250, 250, 0.3)", fontSize: "0.85rem" }}>
                                או
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />
                        </Box>

                        {/* Play Alone Link */}
                        <Box
                            onClick={handlePlayAlone}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                py: 1.5,
                                cursor: "pointer",
                                borderRadius: "12px",
                                transition: "all 0.25s ease",
                                animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "rgba(250, 250, 250, 0.5)",
                                    fontSize: "0.9rem",
                                    transition: "color 0.25s ease",
                                    "&:hover": {
                                        color: "rgba(250, 250, 250, 0.7)",
                                    },
                                }}
                            >
                                התחל לשחק לבד
                            </Typography>
                            <ArrowForwardIcon
                                sx={{
                                    fontSize: "1rem",
                                    color: "rgba(250, 250, 250, 0.4)",
                                    transform: "rotate(180deg)",
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    )
}
