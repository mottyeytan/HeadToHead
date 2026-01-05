import { Box, Button, Container, InputBase } from "@mui/material";
import { useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { GameDescription } from "../features/game/components/GameLobby/GameDescription";
import { games } from "../features/questions/data/categories";
import { useParams, useNavigate } from "react-router-dom";
import routes from "../global/router/model/routes.model";

export const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = games[gameId as keyof typeof games] || null;
  
  // טוען את השם מ-localStorage פעם אחת בהתחלה
  const [playerName, setPlayerName] = useState(() => 
    localStorage.getItem("playerName") || ""
  );

  const handleBack = () => {
    navigate(routes.home);
  };

  const handlePlay = () => {
    // שומר ל-localStorage לפני שמתחילים לשחק
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
    }
    // יצירת מזהה ייחודי לחדר
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log("Starting game:", gameId, "Room:", roomId, "Player:", playerName);
    navigate(routes.gameRoom.replace(":gameId", gameId || "").replace(":roomId", roomId));
  };

  // שומר כשיוצאים מהאינפוט (blur)
  const handleBlur = () => {
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
    }
  };

  const handelEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePlay();
    }
  };
  return (
    <Container maxWidth={false} sx={{ padding: "24px", maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", alignItems: "flex-start" }}>
      <ArrowBackIcon sx={{ fontSize: "1.5rem", color: "#fff", transform: "rotate(180deg)", alignSelf: "flex-start", cursor: "pointer" }} onClick={handleBack} />
    <Box>
      <GameDescription icon={game?.icon || ""} title={game?.title || ""} longDescription={game?.longDescription || ""} />
    </Box>

    <Box sx={{ 
      display: "flex", 
      flexDirection: "row",
      alignSelf: "flex-start",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      borderRadius: "50px",
      overflow: "hidden",
    }}>
      <InputBase
        placeholder="הכנס את שמך..."
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handelEnter}
        sx={{
          py: 2,
          px: 3,
          fontSize: "1.1rem",
          backgroundColor: "rgba(255,255,255,0.95)",
          color: "#333",
          minWidth: "180px",
          direction: "rtl",
          "&::placeholder": {
            color: "rgba(0,0,0,0.5)",
          },
        }}
      />
      <Button 
        variant="contained"
        onClick={handlePlay}
        disabled={!playerName.trim()}
        endIcon={<ArrowBackIcon />}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          py: 2,
          px: 3,
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderRadius: 0,
          background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
          textTransform: "none",
          "&:hover": {
            opacity: 0.9,
          },
          "&:disabled": {
            background: "rgba(150,150,150,0.5)",
            color: "rgba(255,255,255,0.5)",
          },
          transition: "all 0.3s ease",
        }}
      >
        שחק
      </Button>
    </Box>
    </Container>
  );
};