import { Box, Button, Container, Snackbar, Typography, InputBase } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IosShareIcon from '@mui/icons-material/IosShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { games } from "../features/questions/data/categories";
import routes from "../global/router/model/routes.model";
import { Room } from "../features/game/components/Room/Room";

// יצירת מזהה ייחודי לחדר
const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const GameRoom = () => {
    const { gameId, roomId: urlRoomId, inviterName } = useParams();
    const navigate = useNavigate();
    const game = games[gameId as keyof typeof games] || null;
    
    // בדיקה אם זה אורח (הגיע מקישור עם שם מזמין)
    const isGuest = !!inviterName;
    
    // יצירת roomId ייחודי אם לא קיים ב-URL (למארח חדש)
    const roomId = useMemo(() => {
        return urlRoomId || generateRoomId();
    }, [urlRoomId]);
    
    // אם מארח ואין roomId ב-URL - נווט לכתובת עם ה-roomId
    useEffect(() => {
        if (!isGuest && !urlRoomId && gameId) {
            const newPath = routes.gameRoom
                .replace(":gameId", gameId)
                .replace(":roomId", roomId);
            navigate(newPath, { replace: true });
        }
    }, [isGuest, urlRoomId, gameId, roomId, navigate]);
    
    // שם השחקן
    const [guestName, setGuestName] = useState("");
    const [hasJoined, setHasJoined] = useState(false);
    const hostName = localStorage.getItem("playerName") || "אורח";
    const currentPlayerName = isGuest ? guestName : hostName;
    
    const [copied, setCopied] = useState(false);
    
    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    // קישור ההזמנה כולל את ה-roomId הייחודי ושם המזמין (מקודד ל-URL)
    const inviteLink = `${baseUrl}${routes.gameRoomInvite
        .replace(":gameId", gameId || "")
        .replace(":roomId", roomId)
        .replace(":inviterName", encodeURIComponent(hostName))}`;

    const handleBack = () => {
        navigate(routes.gameLobby.replace(":gameId", gameId || ""));
    };

    // פונקציית העתקה שעובדת גם במובייל (HTTP)
    const copyToClipboard = (text: string) => {
        // ניסיון עם API מודרני
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            return;
        }
        
        // fallback למובייל - שיטה ישנה שעובדת ב-HTTP
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
    };

    const handleCopyLink = () => {
        copyToClipboard(inviteLink);
    };

    const handlePlayAlone = () => {
        navigate(routes.gamePlay.replace(":gameId", gameId || ""));
    };

    const handleInviteFriends = async () => {
        const shareText = `${hostName} מזמין אותך למשחק ${game?.title}!\n\n${inviteLink}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    text: shareText,
                });
            } else {
                copyToClipboard(shareText);
            }
        } catch (error) {
            if ((error as Error).name !== "AbortError") {
                copyToClipboard(shareText);
            }
        }
    };

    const handleStartGame = () => {
        navigate(routes.gamePlay.replace(":gameId", gameId || ""));
    };

    const handleJoinRoom = () => {
        if (guestName.trim()) {
            localStorage.setItem("playerName", guestName);
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

            {/* כותרת - שם שחקן ושם משחק */}
            <Box sx={{ 
                textAlign: "center",
                backgroundColor: "rgba(30, 60, 30, 0.6)",
                border: "1px solid rgba(46, 204, 113, 0.3)",
                borderRadius: "20px",
                padding: "24px",
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

            {/* אורח - טופס הצטרפות */}
            {isGuest && !hasJoined && (
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: "row",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    borderRadius: "50px",
                    overflow: "hidden",
                }}>
                    <InputBase
                        placeholder="הכנס את שמך..."
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        sx={{
                            py: 2,
                            px: 3,
                            fontSize: "1.1rem",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            color: "#333",
                            flex: 1,
                            direction: "rtl",
                        }}
                    />
                    <Button 
                        variant="contained"
                        onClick={handleJoinRoom}
                        disabled={!guestName.trim()}
                        endIcon={<LoginIcon />}
                        sx={{
                            py: 2,
                            px: 3,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 0,
                            background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                            textTransform: "none",
                            "&:disabled": {
                                background: "rgba(150,150,150,0.5)",
                                color: "rgba(255,255,255,0.5)",
                            },
                        }}
                    >
                        הצטרף
                    </Button>
                </Box>
            )}

            {/* אורח - אחרי הצטרפות - הצג את החדר */}
            {isGuest && hasJoined && roomId && (
                <Room 
                    gameId={roomId}
                    playerName={currentPlayerName} 
                    onStartGame={handleStartGame}
                    onLeaveRoom={handleBack}
                />
            )}

            {/* לא אורח - נכנס לחדר אוטומטית (רק אחרי שיש roomId ב-URL) */}
            {!isGuest && urlRoomId && (
                <>
                    <Room 
                        gameId={roomId}
                        playerName={hostName} 
                        onStartGame={handleStartGame}
                        onLeaveRoom={handleBack}
                    />

                    {/* כפתורי שיתוף */}
                    <Button
                        variant="contained"
                        onClick={handleInviteFriends}
                        endIcon={<IosShareIcon />}
                        sx={{
                            gap: "10px",
                            py: 2,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            textTransform: "none",
                            "&:hover": {
                                transform: "scale(1.02)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        הזמן חברים
                    </Button>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(30, 60, 30, 0.8)",
                        border: "1px solid rgba(46, 204, 113, 0.3)",
                        borderRadius: "12px",
                        overflow: "hidden",
                    }}>
                        <Typography sx={{ 
                            flex: 1,
                            px: 2,
                            py: 1.5,
                            fontSize: "0.85rem",
                            color: "rgba(255,255,255,0.7)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            direction: "ltr",
                        }}>
                            {inviteLink}
                        </Typography>
                        <Button
                            onClick={handleCopyLink}
                            endIcon={<ContentCopyIcon />}
                            sx={{
                                px: 1,
                                py: 1.5,
                                borderRadius: 0,
                                backgroundColor: "rgba(46, 204, 113, 0.2)",
                                color: "#2ecc71",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "rgba(46, 204, 113, 0.3)" },
                            }}
                        >
                        </Button>
                    </Box>

                    {/* מפריד ושחק לבד */}
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

            {/* הודעה שהקישור הועתק */}
            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                message="הקישור הועתק 📋"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{
                    width: "100px",
                    maxWidth: "100px",
                    margin: "0 auto",
                }}
            />
        </Container>
    )
}
